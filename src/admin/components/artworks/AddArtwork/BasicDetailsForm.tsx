import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import cookie from 'js-cookie';
import { useForm } from 'react-hook-form';
import { rem } from 'polished';
import { yupResolver } from '@hookform/resolvers/yup';

import ArtistSearchAutoComplete from '../ArtistSearchAutoComplete';
import Radio from '../Radio';
import MaterialDropdown from '../MaterialDropdown';
import AddArtworkSubmitButtonWrapper from './AddArtworkSubmitButtonWrapper';

import { convertInt, convertFloat } from '../../../../helpers';
import { Art, ImageSize } from '../../../types';
import { artService } from '../../../../services';
import { addArtworkBasicValidationSchema } from '../../../helpers';

import {
  materialDisabled,
  materialDisabled2,
  materialOptions,
  materialOptions2
} from '../../../constants/Materials';

import { ServerResponseMessageStatus, AlertColorType } from '../../../../types';
import Div from '../../../../components/styled/Div';
import FormRow from '../../styled/FomRow';
import ValidationText from '../../../../components/styled/ValidationText';

import {
  AdminSubmitButtonStyles,
  DangerStyles,
  PrimaryStyles
} from '../../../styles/reuse';
import AdminFormInput from '../../styled/AdminFormInput';
import AdminFormDateInput from '../../styled/AdminFormDateInput';
import AdminSingleFileUpload from '../../styled/AdminSingleFileUpload';
import AdminTextarea from '../../styled/AdminTextarea';

import Alert from '../../../../components/reusable/Alert';
import Spinner from '../../../../components/reusable/Spinner';

// Redux Persist State
import { useSelector, useDispatch } from 'react-redux';
import {
  saveStep,
  getBasicDetails,
  getStoredArtistId,
  getArtUrl,
  getBasicSubmit,
  saveArtId,
  saveBasicDetail,
  resetArtworkForm
} from '../../../../redux/slices/artworkSlice';
import { persistor } from '../../../../redux/store';

// Component => Most complex form
export default function BasicDetailsForm() {
  // ✅  ------------------ Selectors and Actions  ------------------
  const artistIdStored = useSelector(getStoredArtistId);
  const artUrl = useSelector(getArtUrl);
  const basicDetails = useSelector(getBasicDetails);
  const isBasicSubmit = useSelector(getBasicSubmit);

  const dispatch = useDispatch();

  // 💣  ------------------ End - Selectors and Actions  ------------------

  // ✅  ------------------ State management ------------------

  const [artistId, setArtistId] = useState<string>(artistIdStored);

  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');

  // These are the states that will help us track the type of submission
  const [draftSubmission, setDraftSubmission] = useState<boolean>(false); // use only for the draft submission
  const [approvalSubmission, setApprovalSubmission] = useState<boolean>(false); // use only for the approval submission

  const [resetRender, setResetRender] = useState<boolean>(false); // use to reset the alert component

  const [cleanup, setCleanup] = useState<boolean>(false); // use to remove the image preview after successful submission

  const mountRef = useRef<any>(null);

  // 💣 ------------------ End - State management ------------------

  // ✅  ------------------ useForm hook ------------------
  const formOptions = {
    defaultValues: basicDetails,
    resolver: yupResolver(addArtworkBasicValidationSchema)
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState,
    getValues,
    watch
  } = useForm<any>(formOptions);

  const { errors, isSubmitting } = formState;

  // Watching fields during change
  const watchCategory = watch('category');
  const watchSubCategory = watch('subCategory');

  // Get values of some fields
  const categoryValue = getValues('category');
  const subCategoryValue = getValues('subCategory');

  // 💣 ------------------ End - useForm hook ------------------

  // ✅  ------------------ Functions  ------------------

  function detectSubmissionMode(mode: string, flag: boolean) {
    if (mode === 'draft') {
      setDraftSubmission(flag);
    } else if (mode === 'approval') {
      setApprovalSubmission(flag);
    }
  }

  function onSubmit(data: Art, submissionMode: string) {
    detectSubmissionMode(submissionMode, true);

    setResetRender(true); // Reset the rendering behavior

    const token = cookie.get('token') || ''; // Get the auth token

    // Before Art upload we have to first generate the artID, currently
    // only possible way is to first send the Basic Details to the server.

    // De-structure the Basic details data
    const { artistName } = data;
    const {
      artFile,
      name,
      price,
      registeredDate,
      category,
      subCategory,
      material,
      size,
      holdings,
      collectors,
      source,
      description
    } = data;

    const basicData = {
      artistId: artistId || '',
      name,
      price: convertInt(price),
      registeredDate: registeredDate || new Date(),
      category,
      subCategory,
      material,
      size: getImageSize(size),
      holdings: holdings ? convertInt(holdings) : '',
      collectors: collectors ? convertInt(collectors) : '',
      source,
      description
    };

    return artService
      .addArtDetails(basicData, token)
      .then(async function(response) {
        // It this block has been successfully executed then it means
        // right time to upload Art.
        if (response?.data && response.data?.artId) {
          let artId = response.data.artId;
          const formData = new FormData();
          if (artId) {
            formData.append('artId', artId);

            dispatch(saveArtId(artId)); // Update artID
          }
          formData.append('artFile', artFile);
          try {
            const artResponse = await artService.addArtUpload(formData, token);
            let artURL = '';

            if (artResponse?.data && artResponse.data?.fileUrl) {
              artURL = artResponse.data.fileUrl;
            }

            detectSubmissionMode(submissionMode, true);

            // Now it is right time to update the state
            setAlertColor('success');
            setCleanup(!cleanup); // Cleanup will re-render the Upload component
            setResetRender(false); // Reset the rendering behavior of the Alert
            setServerSideSuccess(response);

            // Update the persisted state and move to step 2
            dispatch(
              saveBasicDetail({
                basic: {
                  artistId: artistId || '',
                  artistName: artistName,
                  artFile: artURL,
                  name: basicData.name,
                  price: basicData.price,
                  registeredDate: basicData.registeredDate.toString(),
                  category: basicData.category,
                  subCategory: basicData.subCategory,
                  material: basicData.material,
                  size: {
                    length: basicData.size.length,
                    width: basicData.size.width,
                    height: basicData.size.height,
                    dimension: basicData.size.dimension
                  },
                  holdings: basicData.holdings,
                  collectors: basicData.collectors,
                  source: basicData.source,
                  description: basicData.description
                }
              })
            );
            dispatch(saveStep(2));
          } catch (error) {
            detectSubmissionMode(submissionMode, false);

            setAlertColor('danger');
            setResetRender(false);
            setServerSideSuccess(error as any);
          }
        }
      })
      .catch(function(error) {
        detectSubmissionMode(submissionMode, false);

        setAlertColor('danger');
        setResetRender(false);
        setServerSideSuccess(error);
      });
  }

  function approval(data: Art) {
    if (confirm('Are you sure you want to send this art for approval?')) {
      return onSubmit(data, 'approval');
    }
  }

  function saveAsDraft(data: Art) {
    if (confirm('Are you sure you want to save this art details in draft?')) {
      return onSubmit(data, 'draft');
    }
  }

  function abortArtProcess() {
    if (
      confirm('Are you sure you want to abort the process of adding artwork?')
    ) {
      dispatch(resetArtworkForm());
      persistor.flush();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Update the getArtistId via autocomplete
  const getArtistId = useCallback((artistId: string) => {
    setArtistId(artistId);
  }, []);

  // 💣 ------------------ End - Functions ------------------

  // ✅ useEffect hook 1 - To reinitialize the values of the SubCategory whenever category wil change.
  useEffect(() => {
    if (mountRef.current) {
      setValue('subCategory', '');
    }
  }, [watchCategory, setValue]);

  // ✅ useEffect hook 2 - To reinitialize the values of the Material whenever subCategory wil change.
  useEffect(() => {
    if (mountRef.current) {
      setValue('material', '');
    }
  }, [watchSubCategory, setValue]);

  // ✅ useEffect hook 3 - This hook help us to skip the extra re-render behavior of the watch fields
  // Note: If you are using multiple useEffects that check for didMountRef,
  // make sure only the last one (on bottom) is setting didMountRef to false.
  // React goes through useEffects in order!
  useEffect(() => {
    mountRef.current = true;
  }, []);

  return (
    <Fragment>
      {serverSideSuccess?.message && !resetRender ? (
        <Alert color={alertColor}>{serverSideSuccess.message}</Alert>
      ) : null}

      <form>
        <BasicDetailsForm.Card>
          <BasicDetailsForm.CardBody>
            <FormRow styled={FRModify1}>
              <Div>
                <ArtistSearchAutoComplete
                  labelText="Artist Name"
                  placeholder="BEEPLE"
                  control={control}
                  name="artistName"
                  getArtistId={getArtistId}
                  defaultValue={{
                    name: getValues('artistName'),
                    _id: artistIdStored || ''
                  }}
                  setValue={setValue}
                  invalid={errors?.artistName && true}
                />

                {errors?.artistName?.message && (
                  <ValidationText $fontWeight={500}>
                    {errors.artistName.message}
                  </ValidationText>
                )}
              </Div>

              <Div>
                {/* System must not allow user to select future date. */}
                <AdminFormDateInput
                  control={control}
                  label={true}
                  labelText="Date"
                  id="registeredDate"
                  maxDate={new Date()}
                />
              </Div>
            </FormRow>

            {/* ------------------ New Wrapper  ------------------ */}

            <BasicDetailsForm.NewWrapper>
              <BasicDetailsForm.NewWrapperBody>
                <BasicDetailsForm.FormGroup>
                  <BasicDetailsForm.FormGroupSideA>
                    {/* ------------------ File Upload  ------------------ */}
                    <Div>
                      <AdminSingleFileUpload
                        key={`reset-render-${cleanup}`}
                        control={control}
                        name="artFile"
                        setValue={setValue}
                        setError={setError}
                        invalid={errors?.artFile && true}
                        initialUrl={artUrl}
                      />
                      {errors?.artFile?.message && (
                        <ValidationText $fontWeight={500}>
                          {errors?.artFile?.message}
                        </ValidationText>
                      )}
                      {/* ------------------ End - File Upload  ------------------ */}
                    </Div>
                  </BasicDetailsForm.FormGroupSideA>

                  <BasicDetailsForm.FormGroupSideB>
                    {/* ------------------ Artist Name & Price  ------------------ */}
                    <FormRow styled={FRModify}>
                      <Div>
                        <AdminFormInput
                          type="text"
                          label={true}
                          labelText="Artwork Name"
                          id="name"
                          placeholder="BEEPLE"
                          RHFRef={{ ...register('name') }}
                          autoComplete="off"
                          invalid={errors?.name && true}
                        />

                        {errors?.name?.message && (
                          <ValidationText $fontWeight={500}>
                            {errors.name.message}
                          </ValidationText>
                        )}
                      </Div>

                      <Div>
                        <AdminFormInput
                          type="text"
                          label={true}
                          labelText="Artwork Price"
                          id="price"
                          placeholder="$500"
                          RHFRef={{ ...register('price') }}
                          autoComplete="off"
                          invalid={errors?.price && true}
                        />
                        {errors?.price?.message && (
                          <ValidationText $fontWeight={500}>
                            {errors.price.message}
                          </ValidationText>
                        )}
                      </Div>
                    </FormRow>
                    {/* ------------------ End - Artist Name & Price  ------------------ */}

                    {/* ------------------ Selection ------------------ */}
                    <BasicDetailsForm.SelectionType>
                      <BasicDetailsForm.SelectionTypeHeading>
                        Artwork Type
                      </BasicDetailsForm.SelectionTypeHeading>

                      <FormRow styled={FRModify}>
                        {/* Category 1 */}
                        <BasicDetailsForm.SelectionWrapper>
                          <Div>
                            <Radio
                              name="category"
                              value="TA"
                              labelText="Traditional"
                              id="traditional"
                              RHFRef={{ ...register('category') }}
                              invalid={errors?.category && true}
                            />
                          </Div>

                          {/* Sub-Category */}

                          <BasicDetailsForm.SubCategoryWrapper>
                            <BasicDetailsForm.SelectionRadioList>
                              <li>
                                <Radio
                                  disabled={categoryValue !== 'TA'}
                                  name="subCategory"
                                  value="Painting"
                                  labelText="Painting"
                                  id="painting"
                                  RHFRef={{ ...register('subCategory') }}
                                  invalid={errors?.subCategory && true}
                                />
                              </li>

                              <li>
                                <Radio
                                  disabled={categoryValue !== 'TA'}
                                  name="subCategory"
                                  value="Drawing"
                                  labelText="Drawing"
                                  id="drawing"
                                  RHFRef={{ ...register('subCategory') }}
                                  invalid={errors?.subCategory && true}
                                />
                              </li>

                              <li>
                                <Radio
                                  disabled={categoryValue !== 'TA'}
                                  name="subCategory"
                                  value="Sculpture"
                                  labelText="Sculpture"
                                  id="sculpture"
                                  RHFRef={{ ...register('subCategory') }}
                                  invalid={errors?.subCategory && true}
                                />
                              </li>
                            </BasicDetailsForm.SelectionRadioList>
                          </BasicDetailsForm.SubCategoryWrapper>

                          {/* End - Sub-Category */}

                          {/* Material */}

                          <BasicDetailsForm.MaterialWrapper>
                            <MaterialDropdown
                              disabled={materialDisabled(
                                categoryValue,
                                subCategoryValue
                              )}
                              control={control}
                              name="material"
                              id="material-traditional"
                              items={materialOptions(
                                categoryValue,
                                subCategoryValue
                              )}
                              setValue={setValue}
                              invalid={errors?.material && true}
                            />

                            {errors?.material?.message && (
                              <ValidationText $fontWeight={500}>
                                {errors.material.message}
                              </ValidationText>
                            )}
                          </BasicDetailsForm.MaterialWrapper>

                          {/* End - Material */}
                        </BasicDetailsForm.SelectionWrapper>
                        {/* End - Category 1 */}

                        {/* Category 2 */}

                        <BasicDetailsForm.SelectionWrapper>
                          <Div>
                            <Radio
                              name="category"
                              value="NFT"
                              labelText="NFT Artwork"
                              id="nft"
                              RHFRef={{ ...register('category') }}
                              invalid={errors?.category && true}
                            />
                          </Div>

                          {/* Sub-Category */}

                          <BasicDetailsForm.SubCategoryWrapper>
                            <BasicDetailsForm.SelectionRadioList>
                              <li>
                                <Radio
                                  disabled={categoryValue !== 'NFT'}
                                  name="subCategory"
                                  value="Image"
                                  labelText="Image"
                                  id="image"
                                  RHFRef={{ ...register('subCategory') }}
                                  invalid={errors?.subCategory && true}
                                />
                              </li>

                              <li>
                                <Radio
                                  disabled={true}
                                  name="subCategory"
                                  value="Video"
                                  labelText="Video"
                                  id="video"
                                  RHFRef={{ ...register('subCategory') }}
                                />
                              </li>

                              <li>
                                <Radio
                                  disabled={true}
                                  name="subCategory"
                                  value="Audio"
                                  labelText="Audio"
                                  id="audio"
                                  RHFRef={{ ...register('subCategory') }}
                                />
                              </li>
                            </BasicDetailsForm.SelectionRadioList>
                          </BasicDetailsForm.SubCategoryWrapper>

                          {/* End- Sub-Category */}

                          {/* Material */}

                          <BasicDetailsForm.MaterialWrapper>
                            <MaterialDropdown
                              disabled={materialDisabled2(
                                categoryValue,
                                subCategoryValue
                              )}
                              control={control}
                              name="material"
                              id="material-nft"
                              items={materialOptions2(
                                categoryValue,
                                subCategoryValue
                              )}
                              setValue={setValue}
                              invalid={errors?.material && true}
                            />

                            {errors?.material?.message && (
                              <ValidationText $fontWeight={500}>
                                {errors.material.message}
                              </ValidationText>
                            )}
                          </BasicDetailsForm.MaterialWrapper>

                          {/* End - Material */}
                        </BasicDetailsForm.SelectionWrapper>

                        {/* End - Category 2 */}
                      </FormRow>
                    </BasicDetailsForm.SelectionType>
                    {/* ------------------ End - Selection ------------------ */}
                  </BasicDetailsForm.FormGroupSideB>
                </BasicDetailsForm.FormGroup>

                {/* ------------------ Artwork Source & Holdings  ------------------ */}
                <FormRow styled={FRModify}>
                  <Div>
                    <AdminFormInput
                      type="text"
                      label={true}
                      labelText={
                        <BasicDetailsForm.Source>
                          Artwork Source{' '}
                          <span>(If fetched from 3rd party)</span>
                        </BasicDetailsForm.Source>
                      }
                      id="source"
                      placeholder="Add Source"
                      RHFRef={{ ...register('source') }}
                      autoComplete="off"
                    />
                  </Div>

                  <Div>
                    <AdminFormInput
                      type="text"
                      label={true}
                      labelText="Holdings"
                      id="holdings"
                      placeholder="Enter Holdings"
                      RHFRef={{ ...register('holdings') }}
                      autoComplete="off"
                      invalid={errors?.holdings && true}
                    />

                    {errors?.holdings?.message && (
                      <ValidationText $fontWeight={500}>
                        {errors.holdings.message}
                      </ValidationText>
                    )}
                  </Div>
                </FormRow>
                {/* ------------------ End - Artwork Source & Holdings  ------------------ */}

                {/* ------------------ Collectors & Size  ------------------ */}
                <FormRow styled={FRModify}>
                  <Div>
                    <AdminFormInput
                      type="text"
                      label={true}
                      labelText="Collectors"
                      id="collectors"
                      placeholder="Enter Collectors"
                      RHFRef={{ ...register('collectors') }}
                      autoComplete="off"
                      invalid={errors?.collectors && true}
                    />

                    {errors?.collectors?.message && (
                      <ValidationText $fontWeight={500}>
                        {errors.collectors.message}
                      </ValidationText>
                    )}
                  </Div>

                  <Div>
                    <Div $marginBottom={8}>
                      <BasicDetailsForm.Label htmlFor="size">
                        Size
                      </BasicDetailsForm.Label>
                    </Div>

                    <FormRow styled={FRModifySize}>
                      <Div>
                        <AdminFormInput
                          type="text"
                          label={false}
                          id="size"
                          placeholder="Dimension"
                          RHFRef={{ ...register('size.dimension') }}
                          autoComplete="off"
                          invalid={errors?.size?.dimension && true}
                        />
                      </Div>

                      <Div>
                        <AdminFormInput
                          type="text"
                          label={false}
                          id="length"
                          placeholder="Length"
                          RHFRef={{ ...register('size.length') }}
                          autoComplete="off"
                          invalid={errors?.size?.length && true}
                        />
                      </Div>

                      <Div>
                        <AdminFormInput
                          type="text"
                          label={false}
                          id="width"
                          placeholder="Width"
                          RHFRef={{ ...register('size.width') }}
                          autoComplete="off"
                          invalid={errors?.size?.width && true}
                        />
                      </Div>

                      <Div>
                        <AdminFormInput
                          type="text"
                          label={false}
                          id="height"
                          placeholder="Height"
                          RHFRef={{ ...register('size.height') }}
                          autoComplete="off"
                          invalid={errors?.size?.height && true}
                        />
                      </Div>
                    </FormRow>

                    {/* Size Error */}
                    {sizeValidationError(errors)}
                    {/* End - Size Error */}
                  </Div>
                </FormRow>
                {/* ------------------ End - Collectors & Size  ------------------ */}

                <Div>
                  <AdminTextarea
                    label={true}
                    labelText="Brief Description"
                    id="description"
                    placeholder="BEEPLE@gmail.com"
                    RHFRef={{ ...register('description') }}
                    invalid={errors?.description && true}
                  />

                  {errors?.description?.message && (
                    <ValidationText $fontWeight={500}>
                      {errors.description.message}
                    </ValidationText>
                  )}
                </Div>
              </BasicDetailsForm.NewWrapperBody>
            </BasicDetailsForm.NewWrapper>
            {/* ------------------ End - New Wrapper  ------------------ */}
          </BasicDetailsForm.CardBody>
        </BasicDetailsForm.Card>
        {/* Button Wrapper */}

        {!isBasicSubmit ? (
          <AddArtworkSubmitButtonWrapper>
            {/* Save as draft */}
            <Div>
              <BasicDetailsForm.ButtonA
                type="button"
                onClick={handleSubmit(saveAsDraft)}
                disabled={isSubmitting}
              >
                {draftSubmission ? (
                  <span>
                    <Spinner marginRight={8} />
                  </span>
                ) : null}
                <span>Save as draft</span>
              </BasicDetailsForm.ButtonA>
            </Div>

            {/* Send for approval */}

            <Div>
              <BasicDetailsForm.ButtonA
                type="button"
                onClick={handleSubmit(approval)}
                disabled={isSubmitting}
              >
                {approvalSubmission ? (
                  <span>
                    <Spinner marginRight={8} />
                  </span>
                ) : null}
                <span>Send for approval</span>
              </BasicDetailsForm.ButtonA>
            </Div>

            {/* Cancel */}
            <Div>
              <BasicDetailsForm.ButtonB type="button" onClick={abortArtProcess}>
                Cancel
              </BasicDetailsForm.ButtonB>
            </Div>
          </AddArtworkSubmitButtonWrapper>
        ) : null}

        {/* End - Button Wrapper */}
      </form>
    </Fragment>
  );
}

// Styled
const FRModify1 = css`
  flex-direction: column;
  & {
    @media (min-width: 1200px) {
      flex-direction: row;
    }
  }
`;

const FRModify = css`
  flex-direction: column;
  & {
    @media (min-width: 1320px) {
      flex-direction: row;
    }
  }
`;

const FRModifySize = css`
  flex-direction: column;

  & > div {
    margin-bottom: 0;
  }

  & {
    @media (min-width: 1320px) {
      flex-direction: row;
    }
  }
`;

BasicDetailsForm.Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  user-select: none;
`;

BasicDetailsForm.Card = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 24px;
`;

BasicDetailsForm.CardBody = styled.div`
  padding: ${rem(48)};
`;

BasicDetailsForm.NewWrapper = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  margin-top: ${rem(16)};
`;

BasicDetailsForm.NewWrapperBody = styled.div`
  padding: ${rem(32)};
`;

BasicDetailsForm.FormGroup = styled.div`
  position: relative;
  & {
    @media (min-width: 992px) {
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      /* For Artwork Source and Holdings */
      margin-bottom: ${rem(8)};
    }
  }
`;

BasicDetailsForm.FormGroupSideA = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${rem(24)};
  & {
    @media (min-width: 992px) {
      display: flex;
      margin-right: ${rem(32)};
    }
  }
`;

BasicDetailsForm.FormGroupSideB = styled.div`
  & {
    @media (min-width: 992px) {
      position: relative;
      flex: 1 1 auto;
      width: 1%;
      min-width: 0;
      margin-bottom: 0;
    }
  }
`;

BasicDetailsForm.SelectionType = styled.div``;

BasicDetailsForm.SelectionTypeHeading = styled.h1`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  user-select: none;
  padding-bottom: ${rem(12)};
  border-bottom: 1px solid #eeeeee;
  margin-bottom: ${rem(16)};
`;

BasicDetailsForm.SelectionWrapper = styled.div``;

// SubCategory
BasicDetailsForm.SubCategoryWrapper = styled.div`
  border-bottom: 1px solid #eeeeee;
  padding: ${rem(16)} 0;
`;

BasicDetailsForm.SelectionRadioList = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #f7f7f9;
  list-style: none;
  border-radius: 3px;

  padding: ${rem(12)} ${rem(18)};
  margin-bottom: 0;

  > li:not(:last-child) {
    margin-right: ${rem(32)};
  }
`;

// Material
BasicDetailsForm.MaterialWrapper = styled.div`
  margin-top: ${rem(16)};
`;

// Artwork Source Heading
BasicDetailsForm.Source = styled.div`
  > span {
    color: #c5c5c5;
    font-size: 12px;
  }
`;

// Button Styles
BasicDetailsForm.ButtonA = styled.button`
  ${AdminSubmitButtonStyles};
  ${PrimaryStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;

BasicDetailsForm.ButtonB = styled.button`
  ${AdminSubmitButtonStyles};
  ${DangerStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;

// Function to return the size error message
function sizeValidationError(error: any) {
  const { size } = error;

  if (size?.dimension?.message) {
    return (
      <ValidationText $fontWeight={500}>
        {size.dimension.message}
      </ValidationText>
    );
  } else if (size?.length?.message) {
    return (
      <ValidationText $fontWeight={500}>{size.length.message}</ValidationText>
    );
  } else if (size?.width?.message) {
    return (
      <ValidationText $fontWeight={500}>{size.width.message}</ValidationText>
    );
  } else if (size?.height?.message) {
    return (
      <ValidationText $fontWeight={500}>{size.height.message}</ValidationText>
    );
  } else {
    return null;
  }
}

// This function will convert image size properties to their associated data type
function getImageSize(size: ImageSize) {
  const { dimension, length, width, height } = size;
  // Return the converted data
  return {
    dimension: convertFloat(dimension),
    length: convertFloat(length),
    width: convertFloat(width),
    height: convertFloat(height)
  };
}
