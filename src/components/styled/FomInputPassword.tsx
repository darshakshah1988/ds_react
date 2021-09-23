import { useState } from 'react';
import styled from 'styled-components';

import { AuthFormInputStyles } from '../../styles/reuse';
import { HidePasswordIcon, PasswordIcon, ShowPasswordIcon } from '../../svgs';

// Types
type InputTypes = 'password';

type Props = {
  type: InputTypes;
  RHFRef: any;
  invalid?: boolean | undefined;
  [index: string]: any;
};

export default function FormInputPassword(props: Props) {
  const { type, invalid, RHFRef, icon, ...attrs } = props;
  const [passwordShown, setPasswordShown] = useState<boolean>(false);

  function togglePasswordVisibility() {
    setPasswordShown(prev => !prev);
  }

  return (
    <FormInputPassword.Wrapper>
      <FormInputPassword.Input
        type={passwordShown ? 'text' : 'password'}
        $invalid={invalid}
        {...attrs}
        {...RHFRef}
      />
      <FormInputPassword.LeftIcon>
        <PasswordIcon />
      </FormInputPassword.LeftIcon>

      <FormInputPassword.RightIcon
        role="button"
        onClick={togglePasswordVisibility}
      >
        {passwordShown ? <ShowPasswordIcon /> : <HidePasswordIcon />}
      </FormInputPassword.RightIcon>
    </FormInputPassword.Wrapper>
  );
}

FormInputPassword.Wrapper = styled.div`
  position: relative;
`;

FormInputPassword.Input = styled.input<{ $invalid?: boolean }>`
  ${AuthFormInputStyles};
  & {
    padding-left: 48px;
    padding-right: 48px;
  }
`;

FormInputPassword.LeftIcon = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  left: 12px;
  top: 0;
  bottom: 0;

  > svg {
    width: 18px;
    height: 18px;
  }
`;

FormInputPassword.RightIcon = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  right: 18px;
  top: 0;
  bottom: 0;
  cursor: pointer;

  > svg {
    width: 18px;
    height: 18px;
  }
`;
