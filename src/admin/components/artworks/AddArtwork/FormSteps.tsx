import styled from 'styled-components';
import { rem } from 'polished';

// Redux Persist State
import { useSelector, useDispatch } from 'react-redux';
import {
  goToStep,
  getStepValue,
  getBasicSubmit,
  getInvestmentSubmit,
  getSaleSubmit
} from '../../../../redux/slices/artworkSlice';

// Component
export default function FormSteps() {
  // ✅  ------------------ Actions ------------------
  const dispatch = useDispatch();
  const step = useSelector(getStepValue);
  const basicSubmit = useSelector(getBasicSubmit);
  const investmentSubmit = useSelector(getInvestmentSubmit);
  const saleSubmit = useSelector(getSaleSubmit);
  // 💣  ------------------ End - Actions ------------------

  // On Refresh always page should display

  return (
    <div>
      {/* ============= Steps ============= */}
      <FormSteps.Wrapper>
        <FormSteps.Nav>
          <li>
            {/* User can click this button, if basic form submission has been completed. */}
            <FormSteps.Button
              type="button"
              className={step === 1 ? 'active' : ''}
              onClick={basicSubmit ? () => dispatch(goToStep(1)) : x => x}
            >
              Basic Details
            </FormSteps.Button>
          </li>

          <li>
            <FormSteps.Button
              type="button"
              className={step === 2 ? 'active' : ''}
              disabled={!basicSubmit}
              onClick={basicSubmit ? () => dispatch(goToStep(2)) : x => x}
            >
              Investment Info
            </FormSteps.Button>
          </li>

          <li>
            <FormSteps.Button
              type="button"
              className={step === 3 ? 'active' : ''}
              disabled={!investmentSubmit}
              onClick={investmentSubmit ? () => dispatch(goToStep(3)) : x => x}
            >
              Sales Info
            </FormSteps.Button>
          </li>

          <li>
            <FormSteps.Button
              type="button"
              className={step === 4 ? 'active' : ''}
              disabled={!saleSubmit}
              onClick={saleSubmit ? () => dispatch(goToStep(4)) : x => x}
            >
              Statistical Info
            </FormSteps.Button>
          </li>
        </FormSteps.Nav>
      </FormSteps.Wrapper>
      {/* ============= End - Steps ============= */}
    </div>
  );
}

// Styles
FormSteps.Wrapper = styled.div`
  display: flex;
`;

FormSteps.Button = styled.button`
  display: block;
  padding: ${rem(10)} ${rem(48)};

  color: #656565;
  font-size: 1rem;
  font-weight: 500;

  background-color: transparent;
  border: 1px solid transparent;
  box-shadow: none;

  user-select: none;
  border-radius: 9999px;
  transition: border-color 0.2s linear, background-color 0.2s ease,
    box-shadow 0.2s ease, color 0.2s ease;

  &:focus {
    outline: 0;
  }

  /* For Disable */
  &:disabled {
    cursor: not-allowed;
  }
`;

FormSteps.Nav = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  list-style: none;
  margin: 0 auto;
  width: 680px;

  padding: ${rem(8)} ${rem(12)};
  background-color: #f9f9f9;

  @media (min-width: 1200px) {
    flex-direction: row;
    border-radius: 9999px;
    margin: 0;
    width: auto;
  }

  ${FormSteps.Button}.active {
    color: #272b2f;
    background-color: #fff;
    border-color: #f1f1f1;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }
`;
