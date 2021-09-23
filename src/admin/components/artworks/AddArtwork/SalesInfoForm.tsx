import { Fragment, useState } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';
import cookie from 'js-cookie';
import { rem } from 'polished';
import { add } from 'date-fns';

import { convertInt } from '../../../../helpers';
import { artService } from '../../../../services';

import AddArtworkSubmitButtonWrapper from './AddArtworkSubmitButtonWrapper';

import Div from '../../../../components/styled/Div';
import FormRow from '../../styled/FomRow';
import AdminFormInput from '../../styled/AdminFormInput';
import AdminFormDateInput from '../../styled/AdminFormDateInput';
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
  getSaleDetails,
  saveSaleDetail,
  resetArtworkForm
} from '../../../../redux/slices/artworkSlice';
import { AlertColorType, ServerResponseMessageStatus } from '../../../../types';
import { persistor } from '../../../../redux/store';

// Types
type DateType = Date | null | undefined;

// Component
export default function SalesInfoForm() {
  // ✅  ------------------ Selectors and Actions  ------------------
  const artIdStored = useSelector(getStoredArtId);
  const saleDetails = useSelector(getSaleDetails);

  const dispatch = useDispatch();

  // 💣  ------------------ End - Selectors and Actions  ------------------

  // ✅  ------------------ State management ------------------
  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [saleStartDate, setSaleStartDate] = useState<DateType>(
    saleDetails?.salesStartDate ? new Date(saleDetails.salesStartDate) : null
  );

  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');

  // These are the states that will help us track the type of submission
  const [draftSubmission, setDraftSubmission] = useState<boolean>(false); // use only for the draft submission
  const [approvalSubmission, setApprovalSubmission] = useState<boolean>(false); // use only for the approval submission

  const [resetRender, setResetRender] = useState<boolean>(false); // use to reset the alert component

  // 💣 ------------------ End - State management ------------------

  // ✅  ------------------ useForm hook ------------------
  const formOptions = {
    defaultValues: saleDetails
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

  function onSaleStartDate(date: DateType) {
    if (date) {
      setSaleStartDate(date);
      // Update other dates
      setValue('salesEndDate', null, {
        shouldValidate: true
      });

      setValue('firstSalesStartDate', add(date, { days: 1 }), {
        shouldValidate: true
      });
      setValue('secondSalesStartDate', add(date, { days: 2 }), {
        shouldValidate: true
      });
      setValue('thirdSalesStartDate', add(date, { days: 3 }), {
        shouldValidate: true
      });
    }
  }

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
      salesStartDate,
      salesEndDate,
      firstSalesStartDate,
      firstSalesQty,
      secondSalesStartDate,
      secondSalesQty,
      thirdSalesStartDate,
      thirdSalesQty
    } = data;

    const saleData = {
      salesStartDate: salesStartDate,
      salesEndDate: salesEndDate,
      firstSalesStartDate: firstSalesStartDate,
      firstSalesQty: convertInt(firstSalesQty),
      secondSalesStartDate: secondSalesStartDate,
      secondSalesQty: convertInt(secondSalesQty),
      thirdSalesStartDate: thirdSalesStartDate,
      thirdSalesQty: convertInt(thirdSalesQty)
    };

    const saleInfo = {
      artId: artIdStored || '',
      type: 'salesInfo',
      value: saleData
    };

    return artService
      .editArtTypeDetails(saleInfo, token)
      .then(function(response) {
        // Now it is right time to update the state
        setAlertColor('success');
        setResetRender(false); // Reset the rendering behavior of the Alert
        setServerSideSuccess(response);

        // Update the persisted state and move to step 2
        dispatch(
          saveSaleDetail({
            sale: {
              salesStartDate: saleData.salesStartDate.toString(),
              salesEndDate: saleData.salesEndDate.toString(),

              firstSalesStartDate: saleData.firstSalesStartDate.toString(),
              firstSalesQty: saleData.firstSalesQty,

              secondSalesStartDate: saleData.secondSalesStartDate.toString(),
              secondSalesQty: saleData.secondSalesQty,

              thirdSalesStartDate: saleData.thirdSalesStartDate.toString(),
              thirdSalesQty: saleData.thirdSalesQty
            }
          })
        );
        dispatch(saveStep(4));
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

      <SalesInfoForm.Card>
        <SalesInfoForm.CardBody>
          {/* ------------------ 1st Form Row  ------------------ */}
          <FormRow styled={FRModify}>
            <Div>
              <AdminFormDateInput
                control={control}
                label={true}
                labelText="Sales start date"
                id="salesStartDate"
                onSelectDate={onSaleStartDate}
                minDate={add(new Date(), { days: 1 })}
              />
            </Div>

            <Div>
              <AdminFormDateInput
                control={control}
                label={true}
                labelText="Sales end date"
                id="salesEndDate"
                minDate={saleStartDate ? add(saleStartDate, { days: 1 }) : null}
              />
            </Div>
          </FormRow>
          {/* ------------------ End - 1st Form Row  ------------------ */}

          {/* ------------------ 2nd Form Row  ------------------ */}
          <FormRow styled={FRModify2}>
            {/* ------------------ First Col  ------------------ */}
            <Div>
              <Div $marginBottom={8}>
                <SalesInfoForm.Label htmlFor="firstSaleStartDate">
                  1st Sale start date and sale qty
                </SalesInfoForm.Label>
              </Div>

              <FormRow styled={FRModify}>
                <Div>
                  <AdminFormDateInput
                    control={control}
                    label={false}
                    id="firstSalesStartDate"
                    maxDate={
                      saleStartDate ? add(saleStartDate, { days: 1 }) : null
                    }
                    minDate={
                      saleStartDate ? add(saleStartDate, { days: 1 }) : null
                    }
                  />
                </Div>

                <Div>
                  <AdminFormInput
                    type="text"
                    label={false}
                    id="firstSalesQty"
                    RHFRef={{ ...register('firstSalesQty') }}
                    placeholder="Sale Qty"
                    autoComplete="off"
                  />
                </Div>
              </FormRow>
            </Div>
            {/* ------------------ End - First Col  ------------------ */}

            {/* ------------------ Second Col  ------------------ */}
            <Div>
              <Div $marginBottom={8}>
                <SalesInfoForm.Label htmlFor="secondSaleStartDate">
                  2nd Sales start date and sale qty
                </SalesInfoForm.Label>
              </Div>

              <FormRow styled={FRModify}>
                <Div>
                  <AdminFormDateInput
                    control={control}
                    label={false}
                    id="secondSalesStartDate"
                    maxDate={
                      saleStartDate ? add(saleStartDate, { days: 2 }) : null
                    }
                    minDate={
                      saleStartDate ? add(saleStartDate, { days: 2 }) : null
                    }
                  />
                </Div>

                <Div>
                  <AdminFormInput
                    type="text"
                    label={false}
                    id="secondSalesQty"
                    RHFRef={{ ...register('secondSalesQty') }}
                    placeholder="Sale Qty"
                    autoComplete="off"
                  />
                </Div>
              </FormRow>
            </Div>
            {/* ------------------ End - Second Col  ------------------ */}
          </FormRow>
          {/* ------------------ End - 2nd Form Row  ------------------ */}

          {/* ------------------ 3rd Form Row  ------------------ */}
          <FormRow styled={FRModify3}>
            {/* ------------------ First Col  ------------------ */}
            <Div>
              <Div $marginBottom={8}>
                <SalesInfoForm.Label htmlFor="thirdSalesStartDate">
                  3rd Sale start date and sale qty
                </SalesInfoForm.Label>
              </Div>

              <FormRow styled={FRModify}>
                <Div>
                  <AdminFormDateInput
                    control={control}
                    label={false}
                    id="thirdSalesStartDate"
                    maxDate={
                      saleStartDate ? add(saleStartDate, { days: 3 }) : null
                    }
                    minDate={
                      saleStartDate ? add(saleStartDate, { days: 3 }) : null
                    }
                  />
                </Div>

                <Div>
                  <AdminFormInput
                    type="text"
                    label={false}
                    id="thirdSalesQty"
                    RHFRef={{ ...register('thirdSalesQty') }}
                    placeholder="Sale Qty"
                    autoComplete="off"
                  />
                </Div>
              </FormRow>
            </Div>
            {/* ------------------ End - First Col  ------------------ */}
          </FormRow>
          {/* ------------------ End - 3rd Form Row  ------------------ */}
        </SalesInfoForm.CardBody>
      </SalesInfoForm.Card>

      {/* Button Wrapper */}
      <AddArtworkSubmitButtonWrapper>
        {/* Save as draft */}
        <Div>
          <SalesInfoForm.ButtonA
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
          </SalesInfoForm.ButtonA>
        </Div>

        {/* Send for approval */}

        <Div>
          <SalesInfoForm.ButtonA
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
          </SalesInfoForm.ButtonA>
        </Div>

        {/* Cancel */}
        <Div>
          <SalesInfoForm.ButtonB type="button" onClick={abortArtProcess}>
            Cancel
          </SalesInfoForm.ButtonB>
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
  & {
    @media (min-width: 992px) {
      flex-direction: row;
      & > div {
        margin-bottom: 0;
      }
    }
  }
`;

const FRModify3 = css`
  flex-direction: column;
  & {
    @media (min-width: 992px) {
      flex-direction: row;
      & > div {
        max-width: 50%;
        margin-bottom: 0;
      }
    }
  }
`;

SalesInfoForm.Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  user-select: none;
`;

// Styles
SalesInfoForm.SingleRow = styled.div<{
  $marginBottom?: number;
}>`
  display: flex;
  flex-wrap: wrap;
  margin-right: -12px;
  margin-left: -12px;

  & > div {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    padding-right: 12px;
    padding-left: 12px;
  }

  & > div {
    margin-bottom: ${({ $marginBottom }) =>
      $marginBottom ? rem($marginBottom) : rem(20)};
  }
`;

SalesInfoForm.Card = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 24px;
  min-height: 100vh;
  height: 100%;
`;

SalesInfoForm.CardBody = styled.div`
  padding: ${rem(48)};
`;

// Button Styles
SalesInfoForm.ButtonA = styled.button`
  ${AdminSubmitButtonStyles};
  ${PrimaryStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;

SalesInfoForm.ButtonB = styled.button`
  ${AdminSubmitButtonStyles};
  ${DangerStyles};
  & {
    padding: ${rem(10)} ${rem(32)};
  }
`;
