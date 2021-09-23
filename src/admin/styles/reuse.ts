import { css } from 'styled-components';
import { rem } from 'polished';

export const AdminFormInputStyles = css<{ $invalid?: boolean }>`
  display: block;

  width: 100%;
  height: 50px;
  padding: ${rem(12)} ${rem(14)};

  font-size: ${rem(14)};
  font-weight: 500;
  line-height: 1.5;

  color: #212529;
  background-color: #fff;
  border: 1px solid #c5c5c5;

  border-radius: 5px;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  transition: border-color 0.3s ease-in-out;

  &:focus {
    outline: 0;
  }

  &::-webkit-input-placeholder {
    color: #c0c9d7;
  }
  &::-moz-placeholder {
    color: #c0c9d7;
  }
  &::placeholder {
    color: #c0c9d7;
  }

  ${props => {
    const { $invalid } = props;
    if ($invalid) {
      return css`
        &:invalid,
        && {
          border-color: #dc3545;
        }
        &:invalid:focus,
        &&:focus {
          border-color: #dc3545;
        }
      `;
    } else {
      return css``;
    }
  }}
`;

export const AdminSubmitButtonStyles = css<{ $disabled?: boolean }>`
  & {
    display: inline-block;

    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    vertical-align: middle;

    cursor: pointer;
    user-select: none;

    padding: 12px 14px;
    border-radius: 3px;

    border: 1px solid transparent;
    color: #ffffff;
    background-color: transparent;
  }

  &&:disabled {
    pointer-events: none;
    opacity: 0.65;
  }
`;

export const PrimaryStyles = css`
  & {
    border: 1px solid #4e608e;
    color: #ffffff;
    background-color: #4e608e;
    transition: opacity 0.3s ease;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const DangerStyles = css`
  & {
    border: 1px solid #fc686f;
    color: #ffffff;
    background-color: #fc686f;
    transition: opacity 0.3s ease;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const OutlinePrimaryStyles = css`
  & {
    border: 1px solid #4e608e;
    color: #4e608e;
    background-color: transparent;
    transition: opacity 0.3s ease;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const InvalidBorderUtility = css<{ $invalid?: boolean }>`
  ${props => {
    const { $invalid } = props;
    if ($invalid) {
      return css`
        &:invalid,
        && {
          border-color: #dc3545;
        }
        &:invalid:focus,
        &&:focus {
          border-color: #dc3545;
        }
      `;
    } else {
      return css``;
    }
  }}
`;
