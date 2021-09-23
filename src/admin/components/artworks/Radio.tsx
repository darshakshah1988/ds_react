import styled, { css, keyframes } from 'styled-components';
import { rem } from 'polished';

// Props
type Props = {
  name: string;
  value: string;
  id: string;
  labelText: string;
  disabled?: boolean;
  invalid?: boolean;
  RHFRef: any;
};

// Component
export default function Radio(props: Props) {
  const { name, value, id, labelText, invalid, disabled, RHFRef } = props;

  // If disabled React hook form will not pick value.
  if (disabled) {
    return (
      <Radio.Wrapper $disabled={disabled} $invalid={invalid}>
        <input
          type="radio"
          name={name}
          id={id}
          disabled={disabled}
          value={value}
        />
        <label htmlFor={id}>{labelText}</label>
      </Radio.Wrapper>
    );
  }

  return (
    <Radio.Wrapper $invalid={invalid}>
      <input type="radio" name={name} id={id} value={value} {...RHFRef} />
      <label htmlFor={id}>{labelText}</label>
    </Radio.Wrapper>
  );
}

// Styled

const pulse = keyframes`
  0%{
    box-shadow:0 0 0 0 #bdc3c7;
  }
  to{
    box-shadow:0 0 0 1.5em rgba(189,195,199,0);
  }
`;

Radio.Wrapper = styled.div<{ $disabled?: boolean; $invalid?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  min-height: 24px;
  padding-left: 28px;
  margin-bottom: ${rem(2)};

  & input[type='radio'] {
    position: absolute;
    left: 0;
    z-index: -1;
    width: 24px;
    height: 24px;
    opacity: 0;
  }

  & label {
    position: relative;
    color: #718898;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0;
    vertical-align: top;
    user-select: none;
    cursor: pointer;
  }

  /* Without selection */
  & label:before,
  & label:after {
    content: '';
    position: absolute;
    top: 0;
    left: -28px;
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.5s ease;
  }

  & label:before {
    background-color: #fff;
    border: 2px solid #656565;
  }

  & label:after {
    background-color: #fff;
    border: 2px solid transparent;
    /* This circle will be small as compare to the behind circle. */
    transform: scale(0.4);
  }

  /* After selection */
  & input[type='radio']:checked ~ label:before {
    border-color: #fc686f;
    animation: ${pulse} 1s;
  }

  & input[type='radio']:checked ~ label:after {
    background-color: #fc686f;
  }

  /* Disabled styles */
  ${props => {
    const { $disabled } = props;
    if ($disabled) {
      return css`
        /* For Radio */
        & input[type='radio']:disabled {
          pointer-events: none;
          opacity: 0.5;
        }
        /* For Radio with Label */
        & input[type='radio'][disabled] ~ label,
        input[type='radio']:disabled ~ label {
          pointer-events: none;
          opacity: 0.5;
        }
      `;
    } else {
      return css``;
    }
  }}
  
  /* Invalid styles */
  ${props => {
    const { $invalid } = props;
    if ($invalid) {
      return css`
        & label {
          color: #dc3545;
        }

        & label:before {
          border-color: #dc3545;
        }
      `;
    } else {
      return css``;
    }
  }}
`;
