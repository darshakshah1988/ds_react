import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import { rem } from 'polished';
import cookie from 'js-cookie';

import AddArtworkSubmitButtonWrapper from './AddArtworkSubmitButtonWrapper';

import { artService } from '../../../../services';
import { AlertColorType, ServerResponseMessageStatus } from '../../../../types';
import { convertInt } from '../../../../helpers';

import Div from '../../../../components/styled/Div';
import FormRow from '../../styled/FomRow';
import AdminFormInput from '../../styled/AdminFormInput';
import AdminSingleGraphUpload from '../../styled/AdminSingleGraphUpload';
import {
  AdminSubmitButtonStyles,
  DangerStyles,
  PrimaryStyles
} from '../../../styles/reuse';

import Alert from '../../../../components/reusable/Alert';
import Spinner from '../../../../components/reusable/Spinner';

// Redux Persist State
import { useSelector, useDispatch } from 'react-redux';
import {
  getStoredArtId,
  getStatDetails,
  saveStatDetail,
  resetArtworkForm
} from '../../../../redux/slices/artworkSlice';
import { persistor } from '../../../../redux/store';

// Component
export default function StatisticalInfoForm() {
  // Get router
  const router = useRouter();

  // ✅  ------------------ Selectors and Actions  ------------------
  const artIdStored = useSelector(getStoredArtId);
  const statDetails = useSelector(getStatDetails);
  const dispatch = useDispatch();

  // 💣  ------------------ End - Selectors and Actions  ------------------

  // ✅  ------------------ State management ------------------
  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');

  // These are the states that will help us track the type of submission
  const [draftSubmission, setDraftSubmission] = useState<boolean>(false); // use only for the draft submission
  const [approvalSubmission, setApprovalSubmission] = useState<boolean>(false); // use only for the approval submission

  const [resetRender, setResetRender] = useState<boolean>(false); // use to reset the alert component

  // 💣 ------------------ End - State management ------------------

  // ✅  ------------------ useForm hook ------------------
  const formOptions = {
    defaultValues: statDetails
    // resolver: yupResolver(addArtworkBasicValidationSchema)
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

  // 💣 ------------------ End - useForm hook ------------------

  // ✅  ------------------ Functions  ------------------
  function detectSubmissionMode(mode: string, flag: boolean) {
    if (mode === 'draft') {
      setDraftSubmission(flag);
    } else if (mode === 'approval') {
      setApprovalSubmission(flag);
    }
  }

  function onSubmit(data: any, submissionMode: string) {
    detectSubmissionMode(submissionMode, true);

    setResetRender(true); // Reset the rendering behavior

    const token = cookie.get('token') || ''; // Get the auth token

    // De-structure the Basic details data
    const {
      similarWorkAvgAnnualGrowth,
      statisticsSimilarArtwork,
      highTradingVolumeAndTradingPrice,
      estimatedValue,
      avgAnnualValueGrowthRateOfSimilarArtwork,
      avgAnnualAuctionTransactionInLast3Years
    } = data;

    const statData = {
      similarWorkAvgAnnualGrowth: convertInt(similarWorkAvgAnnualGrowth),
      statisticsSimilarArtwork: convertInt(statisticsSimilarArtwork),
      highTradingVolumeAndTradingPrice: convertInt(
        highTradingVolumeAndTradingPrice
      ),
      estimatedValue: convertInt(estimatedValue),
      avgAnnualValueGrowthRateOfSimilarArtwork: convertInt(
        avgAnnualValueGrowthRateOfSimilarArtwork
      ),
      avgAnnualAuctionTransactionInLast3Years: convertInt(
        avgAnnualAuctionTransactionInLast3Years
      )
    };

    const statInfo = {
      artId: artIdStored || '',
      type: 'statisticalInfo',
      value: statData
    };

    return artService
      .editArtTypeDetails(statInfo, token)
      .then(async function(response) {
        // Now it is right time to update the state
        setAlertColor('success');
        setResetRender(false); // Reset the rendering behavior of the Alert
        setServerSideSuccess(response);

        // Update the persisted state and move to step 2
        dispatch(
          saveStatDetail({
            stat: {
              similarWorkAvgAnnualGrowth: statData.similarWorkAvgAnnualGrowth,
              statisticsSimilarArtwork: statData.statisticsSimilarArtwork,
              highTradingVolumeAndTradingPrice:
                statData.highTradingVolumeAndTradingPrice,
              estimatedValue: statData.estimatedValue,
              avgAnnualValueGrowthRateOfSimilarArtwork:
                statData.avgAnnualValueGrowthRateOfSimilarArtwork,
              avgAnnualAuctionTransactionInLast3Years:
                statData.avgAnnualAuctionTransactionInLast3Years
            }
          })
        );
        dispatch(resetArtworkForm());

        await router.push('/admin/artworks'); // push to the admin/artworks page
      })
      .catch(function(error) {
        detectSubmissionMode(submissionMode, false);

        setAlertColor('danger');
        setResetRender(false);
        setServerSideSuccess(error);
      });
  }

  function approval(data: any) {
    if (confirm('Are you sure you want to send this art for approval?')) {
      return onSubmit(data, 'approval');
    }
  }

  function saveAsDraft(data: any) {
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

  // 💣 ------------------ End - Functions ------------------

  return (
    <Fragment>
      {serverSideSuccess?.message && !resetRender ? (
        <Alert color={alertColor}>{serverSideSuccess.message}</Alert>
      ) : null}
      <StatisticalInfoForm.Card>
        <StatisticalInfoForm.CardBody>
          <FormRow styled={FRModify}>
            <Div>
              <AdminFormInput
                type="text"
                label={true}
                labelText="Similar work average annual growth"
                id="similarWorkAvgAnnualGrowth"
                RHFRef={{ ...register('similarWorkAvgAnnualGrowth') }}
                autoComplete="off"
              />
            </Div>

            <Div>
              <AdminFormInput
                type="text"
                label={true}
                labelText="Statistics about the similar artwork"
                id="statisticsSimilarArtwork"
                RHFRef={{ ...register('statisticsSimilarArtwork') }}
                autoComplete="off"
              />
            </Div>
          </FormRow>

          <FormRow styled={FRModify}>
            <Div>
              <AdminFormInput
                type="text"
                label={true}
                labelText="Works from high trading volume and trading price"
                id="highTradingVolumeAndTradingPrice"
                RHFRef={{ ...register('highTradingVolumeAndTradingPrice') }}
                autoComplete="off"
              />
            </Div>

            <Div>
              <AdminFormInput
                type="text"
                label={true}
                labelText="Estimated value"
                id="estimatedValue"
                RHFRef={{ ...register('estimatedValue') }}
                autoComplete="off"
              />
            </Div>
          </FormRow>

          <FormRow styled={FRModify}>
            <Div>
              <AdminFormInput
                type="text"
                label={true}
                labelText="Average Annual value growth rate of similar artwork"
                id="avgAnnualValueGrowthRateOfSimilarArtwork"
                RHFRef={{
                  ...register('avgAnnualValueGrowthRateOfSimilarArtwork')
                }}
                autoComplete="off"
              />
            </Div>

            <Div>
              <AdminFormInput
                type="text"
                label={true}
                labelText="Average annual auction transaction in last 3 years"
                id="avgAnnualAuctionTransactionInLast3Years"
                RHFRef={{
                  ...register('avgAnnualAuctionTransactionInLast3Years')
                }}
                autoComplete="off"
              />
            </Div>
          </FormRow>

          {/* ------------------ File Upload  ------------------ */}
          <FormRow styled={FRModify2}>
            <Div>
              <AdminSingleGraphUpload
                control={control}
                name="graphUploadA"
                text="Upload Graph"
                onAcceptedFiles={a => undefined}
                onRejectedFiles={a => undefined}
              />
            </Div>
            <Div>
              <AdminSingleGraphUpload
                control={control}
                name="graphUploadB"
                text="Upload Graph"
                onAcceptedFiles={a => undefined}
                onRejectedFiles={a => undefined}
              />
            </Div>
          </FormRow>
          {/* ------------------ End - File Upload  ------------------ */}
        </StatisticalInfoForm.CardBody>
      </StatisticalInfoForm.Card>

      {/* Button Wrapper */}
      <AddArtworkSubmitButtonWrapper>
        {/* Save as draft */}
        <Div>
          <StatisticalInfoForm.ButtonA
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
          </StatisticalInfoForm.ButtonA>
        </Div>

        {/* Send for approval */}

        <Div>
          <StatisticalInfoForm.ButtonA
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
          </StatisticalInfoForm.ButtonA>
        </Div>

        {/* Cancel */}
        <Div>
          <StatisticalInfoForm.ButtonB type="button" onClick={abortArtProcess}>
            Cancel
          </StatisticalInfoForm.ButtonB>
        </Div>
      </AddArtworkSubmitButtonWrapper>
      {/* End - Button Wrapper */}
    </Fragment>
  );
}

// Styled
const FRModify = css`
  flex-direction: column;
  & {
    @media (min-width: 992px) {
      flex-direction: row;
    }
  }
`;

const FRModify2 = css`
  flex-direction: column;
  margin-top: ${rem(8)};
  & {
    @media (min-width: 992px) {
      flex-direction: row;
    }
  }
`;

StatisticalInfoForm.Card = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 24px;
  min-height: 100vh;
  height: 100%;
`;

StatisticalInfoForm.CardBody = styled.div`
  padding: ${rem(48)};
`;

// Button Styles
StatisticalInfoForm.ButtonA = styled.button`
  ${AdminSubmitButtonStyles};
  ${PrimaryStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;

StatisticalInfoForm.ButtonB = styled.button`
  ${AdminSubmitButtonStyles};
  ${DangerStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;
