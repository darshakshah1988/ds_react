import React, { Fragment, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import axios from 'axios';
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

// Component
export default function EditArtistForm(props: any) {
  // State management for the AddArtistForm
  const { artist } = props;

  // It will store all deleteArts ids
  const [deleteArts, setDeleteArts] = useState<Array<string>>([]);

  // Populate data with initial values
  const [initialFormValues, setInitialFormValues] = useState<NewArtist>(artist);

  // Save the artist id which we get during artist details submission
  const [artistId] = useState<string>(artist?._id);

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

  // ------------------ useForm and useFieldArray hook ------------------
  const formOptions = {
    defaultValues: mapValues(initialFormValues),
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
    if (
      confirm('Are you sure you want to reset the form with initial values?')
    ) {
      setDeleteArts([]); // Make delete arts empty
      setCleanup(!cleanup); // Cleanup will re-render the Upload component
      reset(formOptions.defaultValues); // Reset the form
    }
  }

  // ✅ The form submission function
  function onSubmit(data: NewArtist) {
    setResetRender(true); // Reset the rendering behavior
    setShowErrorStack(false); // Reset the Error stack behavior error
    setErrorStack([]); // Reset the Error stack

    const token = cookie.get('token') || ''; // Get the auth token

    // Des-structure all the form data
    const { name, overview, status, profilePicture, notableArtworks } = data;

    // Append form-data for artist
    const formData = new FormData();
    formData.append('id', artistId);
    formData.append('name', name);
    formData.append('overview', overview);
    formData.append('status', status ? 'active' : 'inactive');

    // If the type of this field is not a string then it means
    // new file has been attached so we will append it.
    if (profilePicture && typeof profilePicture !== 'string') {
      formData.append('profilePicture', profilePicture);
    }

    return artistService
      .editArtist(formData, token, setUploadProgress)
      .then(async function(response) {
        let isErrorStack = false;
        let requestForArtist = true;

        // Deleted artworks for delete request
        if (Array.isArray(deleteArts) && deleteArts.length > 0) {
          requestForArtist = false;
          const len = deleteArts.length;
          for (let i = 0; i < len; i++) {
            try {
              await artistService.deleteNotableArt(
                { notableArtworks: deleteArts },
                token
              );
            } catch (err) {}
          }
        }

        // Request sections for the add new and update notableArtworks
        if (Array.isArray(notableArtworks) && notableArtworks.length > 0) {
          // old artworks
          const oldArtworks = notableArtworks.filter(art =>
            art.hasOwnProperty('_id')
          );

          // new artworks
          const newArtworks = notableArtworks.filter(
            art => !art.hasOwnProperty('_id')
          );

          // Old artworks for put request
          if (Array.isArray(oldArtworks) && oldArtworks.length > 0) {
            requestForArtist = false;
            const len = oldArtworks.length;
            for (let i = 0; i < len; i++) {
              const artFormData = new FormData();
              artFormData.append('id', oldArtworks[i]?._id as string); // Be careful, You must have notable artwork ID.
              artFormData.append(
                'notableArtName',
                oldArtworks[i]?.notableArtName
              );
              artFormData.append(
                'notableArtDescription',
                oldArtworks[i]?.notableArtDescription
              );
              // If the type of this field is not a string then it means
              // new file has been attached so we will append it.
              if (
                oldArtworks[i]?.notableArtImage &&
                typeof oldArtworks[i]?.notableArtImage !== 'string'
              ) {
                artFormData.append(
                  'notableArtImage',
                  oldArtworks[i]?.notableArtImage
                );
              }

              try {
                await artistService.editNotableArt(
                  artFormData,
                  token,
                  setUploadProgress
                );
              } catch (err) {
                isErrorStack = true;
                const statement =
                  'The process of updating artwork is not complete with following reason.';

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
          }

          // new artworks for post request
          if (Array.isArray(newArtworks) && newArtworks.length > 0) {
            requestForArtist = false;
            const len = newArtworks.length;
            for (let i = 0; i < len; i++) {
              const artFormData = new FormData();

              artFormData.append('id', artistId); // Be careful, You must have artist ID.

              artFormData.append(
                'notableArtName',
                newArtworks[i]?.notableArtName
              );
              artFormData.append(
                'notableArtDescription',
                newArtworks[i]?.notableArtDescription
              );
              artFormData.append(
                'notableArtImage',
                newArtworks[i]?.notableArtImage
              );

              try {
                await artistService.addNotableArt(
                  artFormData,
                  token,
                  setUploadProgress
                );
              } catch (err) {
                isErrorStack = true;
                const statement =
                  'New artwork has not been uploaded with following reason.';
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
          }
        }

        if (!requestForArtist) {
          artistService
            .getClientSideArtistDetails(artistId, token)
            .then(function(artistResponse) {
              // Execution of states
              setAlertColor('success');
              if (isErrorStack) {
                setShowErrorStack(true); // Error stack will show on the screen
              } else {
                setResetRender(false);
              }

              setCleanup(!cleanup); // Cleanup will re-render the Upload component
              setServerSideSuccess(response); // Top response
              setDeleteArts([]); // Clean art deletion arrays

              setInitialFormValues(artistResponse?.data?.artist); // Whenever this state will update useEffect will re-trigger
            });
        } else {
          artistService
            .getClientSideArtistDetails(artistId, token)
            .then(function(artistResponse) {
              setAlertColor('success');
              setResetRender(false);
              setCleanup(!cleanup); // Cleanup will re-render the Upload component
              setServerSideSuccess(response); // Top response
              setDeleteArts([]); // Clean art deletion arrays

              setInitialFormValues(artistResponse?.data?.artist); // Whenever this state will update useEffect will re-trigger
            });
        }
      })
      .catch(function(error) {
        setAlertColor('danger');
        setResetRender(false);
        setServerSideSuccess(error);
      });
  }

  // ❌ Remove artwork sections
  function removeArt(index: number, id: string) {
    if (id && confirm('Are you sure you want to delete the following art?')) {
      setDeleteArts(oldArray => [...oldArray, id]);
      remove(index); // Remove the section
    } else if (!id) {
      remove(index); // Otherwise remove the section
    }
  }
  // ------------------ End - Functions ------------------

  // ✅ useEffect hook
  // Most importantly, whenever the initial form values in the code will update
  // we must immediately reset the form with those values
  useEffect(() => {
    reset(mapValues(initialFormValues));
  }, [initialFormValues, reset]);

  // ------------------ JSX ------------------

  return (
    <Fragment>
      {serverSideSuccess?.message && !resetRender ? (
        <Alert color={alertColor}>{serverSideSuccess.message}</Alert>
      ) : null}

      {/* ErrorStackError During Art Upload */}
      {showErrorStack ? (
        <ErrorStack
          headingText="Artist details have been updated"
          stack={errorStack}
        />
      ) : null}

      {/* End - ErrorStackError During Art Upload */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fragment>
          {/* Artist Heading */}
          <EditArtistForm.ArtistHeading>
            Artists Details
          </EditArtistForm.ArtistHeading>
          {/* End - Artist Heading */}

          {/* ------------------ Form for the Name and Description ------------------ */}
          <EditArtistForm.ArtistFormCard>
            {/* Flex */}
            <EditArtistForm.ArtistFormCardFlex>
              {/* Flex Item 1 */}
              <Div key={`reset-render-${cleanup}`}>
                <ArtistSingleImageUploader
                  control={control}
                  name="profilePicture"
                  setValue={setValue}
                  setError={setError}
                  invalid={false}
                  initialUrl={getValues('profilePicture')}
                />
              </Div>
              {/* Flex Item 2 */}
              <Div>
                {/* Status */}
                <EditArtistForm.FlexStatus>
                  <EditArtistForm.FlexStatusText>
                    Status
                  </EditArtistForm.FlexStatusText>

                  <EditArtistForm.FlexStatusTextSwitch>
                    <span>Deactive</span>
                    <EditArtistForm.SwitchInput
                      {...register('status')}
                      type="checkbox"
                      defaultChecked={getValues('status')}
                    />
                    <span>Active</span>
                  </EditArtistForm.FlexStatusTextSwitch>
                </EditArtistForm.FlexStatus>

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
            </EditArtistForm.ArtistFormCardFlex>
            {/* End - Flex */}
          </EditArtistForm.ArtistFormCard>
          {/* ------------------ End - Form for the Name and Description ------------------ */}
        </Fragment>

        <Fragment>
          {/* NotableArtFlex */}
          <EditArtistForm.NotableArtFlex>
            {/* NotableArt Heading */}
            <EditArtistForm.ArtworkHeading>
              Notable Artwork
            </EditArtistForm.ArtworkHeading>
            {/* NotableArt Heading */}

            {/* Add NotableArt Button */}
            <EditArtistForm.NotableAddArtButton
              type="button"
              onClick={() => {
                append({
                  notableArtName: '',
                  notableArtDescription: '',
                  notableArtImage: null
                });
              }}
            >
              <PlusIcon width={12} height={12} style={{ marginRight: '8px' }} />
              <span>Add Notable Artwork</span>
            </EditArtistForm.NotableAddArtButton>
            {/* Add NotableArt Button */}
          </EditArtistForm.NotableArtFlex>
          {/* End - NotableArtFlex */}

          {/* ------------------ Form for the Notable Artwork Section ------------------ */}

          {fields.map((field, index) => {
            const {
              _id,
              notableArtName,
              notableArtDescription,
              notableArtImage
            } = field as any;
            return (
              <Fragment key={field.id}>
                {/* Section Heading */}
                {index !== 0 ? (
                  <Fragment>
                    <EditArtistForm.ArtworkIndexHeading>
                      Notable Artwork {index + 1}
                    </EditArtistForm.ArtworkIndexHeading>
                  </Fragment>
                ) : null}
                {/* End - Section Heading */}

                <EditArtistForm.ArtFormCard>
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
                      defaultValue={notableArtName}
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
                      defaultValue={notableArtDescription}
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
                      initialUrl={notableArtImage}
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
                    <EditArtistForm.NotableArtCloseButton
                      type="button"
                      onClick={() => removeArt(index, _id || null)}
                    >
                      <ArtworkUploadCloseIcon />
                    </EditArtistForm.NotableArtCloseButton>
                  </Fragment>
                  {/* End - Notable Art Close Button */}
                </EditArtistForm.ArtFormCard>
              </Fragment>
            );
          })}

          {/* ------------------ End - Form for the Notable Artwork Section ------------------ */}
        </Fragment>

        {/* ------------------ Form Submit Button ------------------ */}
        <EditArtistForm.ButtonGroup>
          <EditArtistForm.ButtonA type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>
                <Spinner marginRight={8} />
              </span>
            ) : null}
            <span>Update</span>
          </EditArtistForm.ButtonA>

          <EditArtistForm.ButtonB type="button" onClick={resetForm}>
            Cancel
          </EditArtistForm.ButtonB>
        </EditArtistForm.ButtonGroup>
        {/* ------------------ End - Form Submit Button ------------------ */}
      </form>
    </Fragment>
  );
  // ------------------ End - JSX ------------------
}

// function to map the form values
function mapValues(data: any) {
  return {
    _id: data?._id || '',
    name: data?.name || '',
    overview: data?.overview || '',
    status: data?.status === 'active',
    profilePicture: data?.profilePicture || null,
    notableArtworks:
      Array.isArray(data.notableArtworks) && data.notableArtworks.length > 0
        ? data.notableArtworks
        : []
  };
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
EditArtistForm.ArtistFormCard = styled.div`
  ${FormCardStyles};
  margin-top: ${rem(24)};
  margin-bottom: ${rem(48)};
`;

// Artist Details Heading
EditArtistForm.ArtistHeading = styled.h1`
  ${HeadingStyles};
  margin-bottom: ${rem(24)};
`;

// Flex
EditArtistForm.ArtistFormCardFlex = styled.div`
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
EditArtistForm.FlexStatus = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-bottom: ${rem(20)};
`;

EditArtistForm.FlexStatusText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #718898;
  margin-bottom: 0;
  margin-right: 64px;
`;

EditArtistForm.FlexStatusTextSwitch = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #718898;
`;

// Switch
EditArtistForm.SwitchInput = styled.input`
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
EditArtistForm.NotableArtFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${rem(32)};
`;

// Notable Artwork Heading
EditArtistForm.ArtworkHeading = styled.h1`
  ${HeadingStyles};
  margin-bottom: 0;
`;

EditArtistForm.ArtworkIndexHeading = styled.h1`
  ${HeadingStyles};
  margin-bottom: ${rem(32)};
`;

// Add Notable Artwork Button
EditArtistForm.NotableAddArtButton = styled.button`
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
EditArtistForm.ArtFormCard = styled.div`
  ${FormCardStyles};
  position: relative;
  margin-bottom: ${rem(48)};
`;

// Notable Art Section Close Button
EditArtistForm.NotableArtCloseButton = styled.button`
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
EditArtistForm.ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button:not(:last-child) {
    margin-right: 16px;
  }
`;

EditArtistForm.ButtonA = styled.button`
  ${AdminSubmitButtonStyles};
  & {
    padding: 8px 40px;
  }
  ${PrimaryStyles};
`;

EditArtistForm.ButtonB = styled.button`
  ${AdminSubmitButtonStyles};

  & {
    padding: 8px 40px;
  }
  ${DangerStyles};
`;
// ------------------ END ------------------
