import styled from 'styled-components';

import { AuthFormInputStyles } from '../../styles/reuse';

// Types
type InputTypes = 'text' | 'email';

type Props = {
  type: InputTypes;
  RHFRef: any;
  invalid?: boolean | undefined;
  icon: React.ReactNode;
  [index: string]: any;
};

export default function FormInput(props: Props) {
  const { type, invalid, RHFRef, icon, ...attrs } = props;
  return (
    <FormInput.Wrapper>
      <FormInput.Input type={type} $invalid={invalid} {...attrs} {...RHFRef} />
      <FormInput.Icon>{icon}</FormInput.Icon>
    </FormInput.Wrapper>
  );
}

FormInput.Wrapper = styled.div`
  position: relative;
`;

FormInput.Input = styled.input<{ $invalid?: boolean }>`
  ${AuthFormInputStyles};
  & {
    padding-left: 48px;
  }
`;

FormInput.Icon = styled.div`
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
