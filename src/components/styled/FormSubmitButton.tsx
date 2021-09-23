import { Fragment } from 'react';
import styled from 'styled-components';

import Spinner from '../reusable/Spinner';
import { AuthButtonStyles } from '../../styles/reuse';

// Props
type Props = {
  disabled?: boolean | undefined;
  icon?: React.ReactNode;
  text: string;
  [prop: string]: any;
};

// Component
export default function FormButton(props: Props) {
  const { disabled, icon, text, ...attrs } = props;

  return (
    <FormButton.Button type="submit" $disabled={disabled} {...attrs}>
      {disabled ? <Spinner marginRight={8} /> : <Fragment>{icon}</Fragment>}
      <span>{text}</span>
    </FormButton.Button>
  );
}

FormButton.Button = styled.button`
  ${AuthButtonStyles};
`;
