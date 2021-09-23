import { Fragment, useEffect } from 'react';

// Redux Persist State
import { useSelector, useDispatch } from 'react-redux';
import {
  getStepValue,
  getCompletedStepValue,
  resetArtworkForm
} from '../../../../redux/slices/artworkSlice';
import { persistor } from '../../../../redux/store';

import FormSteps from './FormSteps';
import BasicDetailsForm from './BasicDetailsForm';
import InvestmentInfoForm from './InvestmentInfoForm';
import SalesInfoForm from './SalesInfoForm';
import StatisticalInfoForm from './StatisticalInfoForm';

import Div from '../../../../components/styled/Div';

export default function AddArtworkForm() {
  // ✅  ------------------ Actions ------------------
  const dispatch = useDispatch();
  const step = useSelector(getStepValue);
  const completedStep = useSelector(getCompletedStepValue);
  // 💣  ------------------ End - Actions ------------------

  if (invalidStep(step)) {
    dispatch(resetArtworkForm());
    persistor.flush(); // Tell the reducer to immediately save the latest state if necessary.
  }

  if (invalidCompletedStep(completedStep)) {
    dispatch(resetArtworkForm());
    persistor.flush(); // Tell the reducer to immediately save the latest state if necessary.
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <Fragment>
      <Div $marginBottom={24}>
        <FormSteps />
      </Div>

      <Div $marginBottom={32}>
        {step === 1 ? <BasicDetailsForm /> : null}
        {step === 2 ? <InvestmentInfoForm /> : null}
        {step === 3 ? <SalesInfoForm /> : null}
        {step === 4 ? <StatisticalInfoForm /> : null}
      </Div>
    </Fragment>
  );
}

function invalidStep(step: number) {
  if (step > 0 && step < 5) {
    return false; // consider valid step so return true
  } else {
    return true; // invalid step
  }
}

function invalidCompletedStep(completedStep: number) {
  if (completedStep > -1 && completedStep < 5) {
    return false; // consider valid completed step so return true
  } else {
    return true; // invalid step
  }
}
