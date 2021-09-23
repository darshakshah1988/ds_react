import { Fragment } from 'react';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import cookie from 'js-cookie';
import { useForm } from 'react-hook-form';
import { rem } from 'polished';

import AddArtworkSubmitButtonWrapper from './AddArtworkSubmitButtonWrapper';

import { convertInt } from '../../../../helpers';
import { artService } from '../../../../services';
import { AlertColorType, ServerResponseMessageStatus } from '../../../../types';

import Div from '../../../../components/styled/Div';
import FormRow from '../../styled/FomRow';
import AdminFormInput from '../../styled/AdminFormInput';
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
  saveStep,
  getStoredArtId,
  getInvestmentDetails,
  saveInvestmentDetail,
  resetArtworkForm
} from '../../../../redux/slices/artworkSlice';
import { persistor } from '../../../../redux/store';

export default function InvestmentInfoForm() {
  // ✅  ------------------ Selectors and Actions  ------------------
  const artIdStored = useSelector(getStoredArtId);
  const investmentDetails = useSelector(getInvestmentDetails);

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
    defaultValues: investmentDetails
    // resolver: yupResolver(addArtworkBasicValidationSchema)
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState,
    getValues
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
      titleHolders,
      ownershipSales,
      remainingPercentageShares,
      residualOrTotalOwnership,
      qtyOfOurHoldings,
      publicOfferingPrice
    } = data;

    const investmentData = {
      titleHolders: titleHolders,
      ownershipSales: convertInt(ownershipSales),
      remainingPercentageShares: convertInt(remainingPercentageShares),
      residualOrTotalOwnership: convertInt(residualOrTotalOwnership),
      qtyOfOurHoldings: convertInt(qtyOfOurHoldings),
      publicOfferingPrice: convertInt(publicOfferingPrice)
    };

    const investmentInfo = {
      artId: artIdStored || '',
      type: 'investmentInfo',
      value: investmentData
    };

    return artService
      .editArtTypeDetails(investmentInfo, token)
      .then(function(response) {
        // Now it is right time to update the state
        setAlertColor('success');
        setResetRender(false); // Reset the rendering behavior of the Alert
        setServerSideSuccess(response);

        // Update the persisted state and move to step 2
        dispatch(
          saveInvestmentDetail({
            investment: {
              titleHolders: investmentData.titleHolders,
              ownershipSales: investmentData.ownershipSales,
              remainingPercentageShares:
                investmentData.remainingPercentageShares,
              residualOrTotalOwnership: investmentData.residualOrTotalOwnership,
              qtyOfOurHoldings: investmentData.qtyOfOurHoldings,
              publicOfferingPrice: investmentData.publicOfferingPrice
            }
          })
        );
        dispatch(saveStep(3));
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

      <InvestmentInfoForm.Card>
        <form>
          <InvestmentInfoForm.CardBody>
            <FormRow styled={FRModify}>
              <Div>
                <AdminFormInput
                  type="text"
                  label={true}
                  labelText="Title holders"
                  id="titleHolders"
                  placeholder="BEEPLE"
                  RHFRef={{ ...register('titleHolders') }}
                  autoComplete="off"
                />
              </Div>

              <Div>
                <AdminFormInput
                  type="text"
                  label={true}
                  labelText="Ownership sales rate%"
                  id="ownershipSales"
                  placeholder="%"
                  RHFRef={{ ...register('ownershipSales') }}
                  autoComplete="off"
                />
              </Div>
            </FormRow>

            <FormRow styled={FRModify}>
              <Div>
                <AdminFormInput
                  type="text"
                  label={true}
                  labelText="Percentage of shares left to be sold"
                  id="remainingPercentageShares"
                  placeholder="%"
                  RHFRef={{ ...register('remainingPercentageShares') }}
                  autoComplete="off"
                />
              </Div>

              <Div>
                <AdminFormInput
                  type="text"
                  label={true}
                  labelText="Residual ownership/ total ownership"
                  id="residualOrTotalOwnership"
                  RHFRef={{ ...register('residualOrTotalOwnership') }}
                  autoComplete="off"
                />
              </Div>
            </FormRow>

            <FormRow styled={FRModify}>
              <Div>
                <AdminFormInput
                  type="text"
                  label={true}
                  labelText="Qty of our holdings"
                  id="qtyOfOurHoldings"
                  placeholder="%"
                  RHFRef={{ ...register('qtyOfOurHoldings') }}
                  autoComplete="off"
                />
              </Div>

              <Div>
                <AdminFormInput
                  type="text"
                  label={true}
                  labelText="Cherie full amount public offering price"
                  id="publicOfferingPrice"
                  RHFRef={{ ...register('publicOfferingPrice') }}
                  autoComplete="off"
                />
              </Div>
            </FormRow>
          </InvestmentInfoForm.CardBody>
        </form>
      </InvestmentInfoForm.Card>

      {/* Button Wrapper */}
      <AddArtworkSubmitButtonWrapper>
        {/* Save as draft */}
        <Div>
          <InvestmentInfoForm.ButtonA
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
          </InvestmentInfoForm.ButtonA>
        </Div>

        {/* Send for approval */}

        <Div>
          <InvestmentInfoForm.ButtonA
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
          </InvestmentInfoForm.ButtonA>
        </Div>

        {/* Cancel */}
        <Div>
          <InvestmentInfoForm.ButtonB type="button" onClick={abortArtProcess}>
            Cancel
          </InvestmentInfoForm.ButtonB>
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

InvestmentInfoForm.Card = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 24px;
  min-height: 100vh;
  height: 100%;
`;

InvestmentInfoForm.CardBody = styled.div`
  padding: ${rem(48)};
`;

// Button Styles
InvestmentInfoForm.ButtonA = styled.button`
  ${AdminSubmitButtonStyles};
  ${PrimaryStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;

InvestmentInfoForm.ButtonB = styled.button`
  ${AdminSubmitButtonStyles};
  ${DangerStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;
