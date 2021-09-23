import { css } from 'styled-components';
import { rem } from 'polished';

export const AuthFormInputStyles = css<{ $invalid?: boolean }>`
  display: block;
  width: 100%;
  padding: 12px 14px;
  height: 56px;

  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;

  color: #000;
  background-color: #fff;
  border: 1px solid #d8d8d8;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 5px;
  box-shadow: none;

  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: 0;
    color: #000;
    border-color: #0029ff;
    box-shadow: 0 4px 11px rgba(19, 53, 235, 0.1);
  }

  &::-webkit-input-placeholder {
    color: #656565;
  }
  &::-moz-placeholder {
    color: #656565;
  }
  &::placeholder {
    color: #656565;
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

export const AuthButtonStyles = css<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${rem(12)} ${rem(48)};

  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-weight: 400;
  line-height: 1.5;

  text-decoration: none;
  vertical-align: middle;

  cursor: pointer;
  user-select: none;

  color: #fff;
  background-color: #000;
  border: 1px solid #000;

  border-radius: 9999px;

  &:hover {
    opacity: 0.8;
  }

  & > svg {
    margin-right: 12px;
  }

  /* For Disable */
  ${({ $disabled }) => {
    if ($disabled) {
      return css`
        &:disabled,
        && {
          pointer-events: none;
          opacity: 0.65;
        }
      `;
    }
  }}
`;
