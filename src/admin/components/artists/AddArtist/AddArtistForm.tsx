import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { useForm, useFieldArray } from 'react-hook-form';
import cookie from 'js-cookie';
import { yupResolver } from '@hookform/resolvers/yup';

import { artistService } from '../../../../services';
import { NewArtist, ErrorStackForArt } from '../../../types';
import { AlertColorType, ServerResponseMessageStatus } from '../../../../types';
import { addArtistValidationSchema } from '../../../helpers';
import Alert from '../../../../components/reusable/Alert';
import Spinner from '../../../../components/reusable/Spinner';
import { PlusIcon, ArtworkUploadCloseIcon } from '../../../svgs';

import ArtistSingleImageUploader from '../ArtistSingleImageUploader';
import NotableArtworkUploader from '../NotableArtworkUploader';
import {
  PrimaryStyles,
  DangerStyles,
  AdminSubmitButtonStyles
} from '../../../styles/reuse';
import Div from '../../../../components/styled/Div';
import ValidationText from '../../../../components/styled/ValidationText';
import ErrorStack from '../../styled/ErrorStack';
import AdminFormInput from '../../styled/AdminFormInput';
import AdminTextarea from '../../styled/AdminTextarea';

// Form Initial values
const initialValues = {
  name: '',
  overview: '',
  status: true,
  profilePicture: null,
  notableArtworks: []
};

// Component
export default function AddArtistForm() {
  // Get router
  const router = useRouter();

  // State management for the AddArtistForm
  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');

  const [, setUploadProgress] = useState<number>(0); // Get the upload progress during upload

  const [cleanup, setCleanup] = useState<boolean>(false); // use to remove the image preview after successful submission

  const [resetRender, setResetRender] = useState<boolean>(false); // use to reset the alert component

  const [errorStack, setErrorStack] = useState<Array<ErrorStackForArt>>([]); // Create the error stack during the notable artworks submission

  const [showErrorStack, setShowErrorStack] = useState<boolean>(false); // Boolean flag to show the error stack of the notable artworks

  const [artistId, setArtistId] = useState<string>(''); // Save the artist id which we get during artist details submission

  // ------------------ useForm and useFieldArray hook ------------------
  const formOptions = {
    defaultValues: initialValues,
    resolver: yupResolver(addArtistValidationSchema)
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState,
    getValues,
    reset
  } = useForm<any>(formOptions);

  const { errors, isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'notableArtworks' // Name of the field. Important: make sure name is in object shape: name=notableArtworks.0.name as we don't support flat arrays.
  });
  // ------------------ End - useForm and useFieldArray------------------

  // ------------------ Functions ------------------

  function resetForm() {
    if (confirm('Are you sure you want to reset the form?')) {
      setCleanup(!cleanup); // Cleanup will re-render the Upload component
      reset(formOptions.defaultValues); // Reset the form
    }
  }

  function onSubmit(data: NewArtist) {
    setResetRender(true); // Reset the rendering behavior
    setShowErrorStack(false); // Reset the Error stack behavior error
    setErrorStack([]); // Reset the Error stack

    const token = cookie.get('token') || ''; // Get the auth token

    // Des-structure all the form data
    const { name, overview, status, profilePicture, notableArtworks } = data;

    // Append form-data for artist
    const formData = new FormData();
    formData.append('name', name);
    formData.append('overview', overview);
    formData.append('status', status ? 'active' : 'inactive');
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    return artistService
      .addArtist(formData, token, setUploadProgress)
      .then(async function(response) {
        // Make upload request for the notableArtworks
        if (Array.isArray(notableArtworks) && notableArtworks.length > 0) {
          const { id } = response.data;

          setArtistId(id); // Save the artist id  for future reference

          let isErrorStack = false;

          // NotableArtworks length
          const len = notableArtworks.length;

          for (let i = 0; i < len; i++) {
            // Create formData object for the notableArt submission
            const artFormData = new FormData();
            // Append art data
            artFormData.append('id', id);
            artFormData.append(
              'notableArtName',
              notableArtworks[i]?.notableArtName
            );
            artFormData.append(
              'notableArtDescription',
              notableArtworks[i]?.notableArtDescription
            );

            artFormData.append(
              'notableArtImage',
              notableArtworks[i]?.notableArtImage
            );

            try {
              await artistService.addNotableArt(
                artFormData,
                token,
                setUploadProgress
              );
            } catch (err) {
              isErrorStack = true;
              const statement = `Artwork no ${i +
                1} has not been uploaded with following reason.`;

              let reason = 'An internal server error occurred';
              if (axios.isAxiosError(err)) {
                reason = err.message;
              }

              setErrorStack(oldArray => [
                ...oldArray,
                {
                  section: i + 1,
                  status: 'error',
                  message: { statement, reason }
                }
              ]);
            }
          }

          // Execution of statements
          setAlertColor('success');
          // Render error stack or alert
          if (isErrorStack) {
            setShowErrorStack(true); // Error stack will show on the screen
          } else {
            setResetRender(false);
          }
          setCleanup(!cleanup); // Cleanup will re-render the Upload component
          setServerSideSuccess(response);
          reset(formOptions.defaultValues); // Reset the form

          await router.push('/admin/artists'); // push to the admin/artists page
          // End - Block
        } else {
          setAlertColor('success');
          setResetRender(false);
          setCleanup(!cleanup); // Cleanup will re-render the Upload component
          setServerSideSuccess(response);

          reset(formOptions.defaultValues); // Reset the form

          await router.push('/admin/artists'); // push to the admin/artists page
        }
      })
      .catch(function(error) {
        setAlertColor('danger');
        setResetRender(false);
        setServerSideSuccess(error);
      });
  }
  // ------------------ End - Functions ------------------

  // ------------------ JSX ------------------

  return (
    <Fragment>
      {serverSideSuccess?.message && !resetRender ? (
        <Alert color={alertColor}>{serverSideSuccess.message}</Alert>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fragment>
          {/* ErrorStackError During Art Upload */}

          {showErrorStack ? (
            <ErrorStack
              headingText="Artist detail added successfully"
              stack={errorStack}
            >
              <AddArtistForm.ErrorStackText>
                You can add more artworks from the{' '}
                <a href={`/admin/artists/edit/${artistId}`}>edit</a> section of
                the following{' '}
                <a href={`/admin/artists/edit/${artistId}`}>artist</a>.
              </AddArtistForm.ErrorStackText>
            </ErrorStack>
          ) : null}

          {/* End - ErrorStackError During Art Upload */}

          {/* Artist Heading */}
          <AddArtistForm.ArtistHeading>
            Artists Details
          </AddArtistForm.ArtistHeading>
          {/* End - Artist Heading */}

          {/* ------------------ Form for the Name and Description ------------------ */}
          <AddArtistForm.ArtistFormCard>
            {/* Flex */}
            <AddArtistForm.ArtistFormCardFlex>
              {/* Flex Item 1 */}
              <Div key={`reset-render-${cleanup}`}>
                <ArtistSingleImageUploader
                  control={control}
                  name="profilePicture"
                  setValue={setValue}
                  setError={setError}
                  invalid={false}
                />
              </Div>
              {/* Flex Item 2 */}
              <Div>
                {/* Status */}
                <AddArtistForm.FlexStatus>
                  <AddArtistForm.FlexStatusText>
                    Status
                  </AddArtistForm.FlexStatusText>

                  <AddArtistForm.FlexStatusTextSwitch>
                    <span>Deactive</span>
                    <AddArtistForm.SwitchInput
                      {...register('status')}
                      type="checkbox"
                      defaultChecked={getValues('status')}
                    />
                    <span>Active</span>
                  </AddArtistForm.FlexStatusTextSwitch>
                </AddArtistForm.FlexStatus>

                {/* End - Status */}
                <Div $marginBottom={24}>
                  <AdminFormInput
                    type="text"
                    label={true}
                    labelText="Artist Name"
                    id="name"
                    placeholder="BEEPLE"
                    RHFRef={{ ...register('name') }}
                    invalid={errors?.name && true}
                    autoComplete="off"
                  />

                  {errors.name?.message && (
                    <ValidationText $fontWeight={500}>
                      {errors.name?.message}
                    </ValidationText>
                  )}
                </Div>

                <Div $marginBottom={32}>
                  <AdminTextarea
                    label={true}
                    labelText="Overview"
                    id="overview"
                    placeholder="BEEPLE@gmail.com"
                    RHFRef={{ ...register('overview') }}
                    invalid={errors?.overview && true}
                  />

                  {errors.overview?.message && (
                    <ValidationText $fontWeight={500}>
                      {errors.overview?.message}
                    </ValidationText>
                  )}
                </Div>
              </Div>
            </AddArtistForm.ArtistFormCardFlex>
            {/* End - Flex */}
          </AddArtistForm.ArtistFormCard>
          {/* ------------------ End - Form for the Name and Description ------------------ */}
        </Fragment>

        <Fragment>
          {/* NotableArtFlex */}
          <AddArtistForm.NotableArtFlex>
            {/* NotableArt Heading */}
            <AddArtistForm.ArtworkHeading>
              Notable Artwork
            </AddArtistForm.ArtworkHeading>
            {/* NotableArt Heading */}

            {/* Add NotableArt Button */}
            <AddArtistForm.NotableAddArtButton
              type="button"
              onClick={() => {
                append({ notableArtImage: null });
              }}
            >
              <PlusIcon width={12} height={12} style={{ marginRight: '8px' }} />
              <span>Add Notable Artwork</span>
            </AddArtistForm.NotableAddArtButton>
            {/* Add NotableArt Button */}
          </AddArtistForm.NotableArtFlex>
          {/* End - NotableArtFlex */}

          {/* ------------------ Form for the Notable Artwork Section ------------------ */}

          {fields.map((field, index) => {
            return (
              <Fragment key={field.id}>
                {/* Section Heading */}
                {index !== 0 ? (
                  <Fragment>
                    <AddArtistForm.ArtworkIndexHeading>
                      Notable Artwork {index + 1}
                    </AddArtistForm.ArtworkIndexHeading>
                  </Fragment>
                ) : null}
                {/* End - Section Heading */}

                <AddArtistForm.ArtFormCard>
                  <Div $marginBottom={24}>
                    <AdminFormInput
                      type="text"
                      label={true}
                      labelText="Name of Artwork"
                      id={`notableArtworks.${index}.notableArtName`}
                      placeholder="BEEPLE"
                      RHFRef={{
                        ...register(`notableArtworks.${index}.notableArtName`)
                      }}
                      invalid={
                        errors?.notableArtworks?.[index]?.notableArtName && true
                      }
                      autoComplete="off"
                    />

                    {errors?.notableArtworks?.[index]?.notableArtName
                      ?.message && (
                      <ValidationText $fontWeight={500}>
                        {
                          errors?.notableArtworks?.[index]?.notableArtName
                            ?.message
                        }
                      </ValidationText>
                    )}
                  </Div>

                  <Div $marginBottom={24}>
                    <AdminTextarea
                      label={true}
                      labelText="Brief Description"
                      id={`notableArtworks.${index}.notableArtDescription`}
                      placeholder="BEEPLE@gmail.com"
                      RHFRef={{
                        ...register(
                          `notableArtworks.${index}.notableArtDescription`
                        )
                      }}
                      invalid={
                        errors?.notableArtworks?.[index]
                          ?.notableArtDescription && true
                      }
                    />

                    {errors?.notableArtworks?.[index]?.notableArtDescription
                      ?.message && (
                      <ValidationText $fontWeight={500}>
                        {
                          errors?.notableArtworks?.[index]
                            ?.notableArtDescription?.message
                        }
                      </ValidationText>
                    )}
                  </Div>
                  {/* ------------------ File Upload  ------------------ */}
                  <Div>
                    <NotableArtworkUploader
                      control={control}
                      name={`notableArtworks.${index}.notableArtImage`}
                      setValue={setValue}
                      setError={setError}
                      invalid={
                        errors?.notableArtworks?.[index]?.notableArtImage &&
                        true
                      }
                    />
                    {errors?.notableArtworks?.[index]?.notableArtImage
                      ?.message && (
                      <ValidationText $fontWeight={500}>
                        {
                          errors?.notableArtworks?.[index]?.notableArtImage
                            ?.message
                        }
                      </ValidationText>
                    )}
                  </Div>
                  {/* ------------------ End - File Upload  ------------------ */}

                  {/* Notable Art Close Button */}
                  <Fragment>
                    <AddArtistForm.NotableArtCloseButton
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <ArtworkUploadCloseIcon />
                    </AddArtistForm.NotableArtCloseButton>
                  </Fragment>
                  {/* End - Notable Art Close Button */}
                </AddArtistForm.ArtFormCard>
              </Fragment>
            );
          })}

          {/* ------------------ End - Form for the Notable Artwork Section ------------------ */}
        </Fragment>

        {/* ------------------ Form Submit Button ------------------ */}
        <AddArtistForm.ButtonGroup>
          <AddArtistForm.ButtonA type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>
                <Spinner marginRight={8} />
              </span>
            ) : null}
            <span>Save</span>
          </AddArtistForm.ButtonA>

          <AddArtistForm.ButtonB type="button" onClick={resetForm}>
            Cancel
          </AddArtistForm.ButtonB>
        </AddArtistForm.ButtonGroup>
        {/* ------------------ End - Form Submit Button ------------------ */}
      </form>
    </Fragment>
  );
  // ------------------ End - JSX ------------------
}

// Styled components
const FormCardStyles = css`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  padding: 48px;
  margin-top: 24px;
`;

const HeadingStyles = css`
  font-size: ${rem(18)};
  font-weight: 500;
  line-height: 1.2;
  color: #000;
`;

// ------------------ START ------------------

// Artist Form Card
AddArtistForm.ArtistFormCard = styled.div`
  ${FormCardStyles};
  margin-top: ${rem(24)};
  margin-bottom: ${rem(48)};
`;

// Artist Details Heading
AddArtistForm.ArtistHeading = styled.h1`
  ${HeadingStyles};
  margin-bottom: ${rem(24)};
`;

AddArtistForm.ErrorStackText = styled.h1`
  font-size: ${rem(16)};
  font-weight: 700;
  line-height: 1.2;
  color: #664d03;
  margin-top: ${rem(16)};
  > a {
    color: #664d03;
    text-decoration: underline;
  }
`;

// Flex
AddArtistForm.ArtistFormCardFlex = styled.div`
  display: flex;

  > div:first-child {
    flex-grow: 0;
    margin-right: ${rem(32)};
  }

  > div {
    flex-grow: 1;
  }
`;

// Status
AddArtistForm.FlexStatus = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-bottom: ${rem(20)};
`;

AddArtistForm.FlexStatusText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #718898;
  margin-bottom: 0;
  margin-right: 64px;
`;

AddArtistForm.FlexStatusTextSwitch = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #718898;
`;

// Switch
AddArtistForm.SwitchInput = styled.input`
  & {
    margin: 0 12px;
  }

  /* 
  To make a switch we will use data urls Technique which is 
  nothing but a background-image technique for the circle shift/
  Note for switch:
  These 3 properties are very important
   1. height (The given switch height e.g. 19)
   2. width (It would be a multiple of height e.g. 19 * 2 = 38)
   3. border-radius (Border radius should match with the width e.g. 38)
  */

  height: 20px;
  width: 38px;
  border-radius: 38px;

  background-color: #fff;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  border: 1px solid rgba(0, 0, 0, 0.25);

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  -webkit-print-color-adjust: exact;
  color-adjust: exact;

  transition: background-color 0.15s ease-in-out,
    background-position 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &:checked {
    background-color: #fc686f;
    border-color: #fc686f;
  }

  /* Switch Styling when disabled. */
  & {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e");
    background-position: left center;
  }

  &:checked {
    background-position: right center;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
  }
`;

// ------------------ END ------------------

// ------------------ START ------------------

// Notable Artwork Flex
AddArtistForm.NotableArtFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${rem(32)};
`;

// Notable Artwork Heading
AddArtistForm.ArtworkHeading = styled.h1`
  ${HeadingStyles};
  margin-bottom: 0;
`;

AddArtistForm.ArtworkIndexHeading = styled.h1`
  ${HeadingStyles};
  margin-bottom: ${rem(32)};
`;

// Add Notable Artwork Button
AddArtistForm.NotableAddArtButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 500;
  padding: 12px 18px;

  border-radius: 3px;

  ${DangerStyles};

  &:focus {
    outline: 0;
  }
`;

// Notable Artwork Form Card
AddArtistForm.ArtFormCard = styled.div`
  ${FormCardStyles};
  position: relative;
  margin-bottom: ${rem(48)};
`;

// Notable Art Section Close Button
AddArtistForm.NotableArtCloseButton = styled.button`
  position: absolute;
  top: -12px;
  right: -8px;
  background-color: #fff;
  border: 1px solid #dfdfdf;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:focus {
    outline: 0;
  }

  > svg {
    width: 12px;
    height: 12px;
  }
`;
// End - Notable Art Section Close Button

// ------------------ END ------------------

// ------------------ START ------------------
// Button Group
AddArtistForm.ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button:not(:last-child) {
    margin-right: 16px;
  }
`;

AddArtistForm.ButtonA = styled.button`
  ${AdminSubmitButtonStyles};
  & {
    padding: 8px 40px;
  }
  ${PrimaryStyles};
`;

AddArtistForm.ButtonB = styled.button`
  ${AdminSubmitButtonStyles};

  & {
    padding: 8px 40px;
  }
  ${DangerStyles};
`;
// ------------------ END ------------------
