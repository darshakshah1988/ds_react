import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import { showAuthFormOverlay } from '../../../redux/slices/layoutSlice';
import { authService } from '../../../services';
import {
  AlertColorType,
  NewPassword,
  UserIdWithToken,
  ServerResponseMessageStatus,
  ServerErrorField
} from '../../../types';
import {
  getServerValidationErrors,
  resetPasswordTokenValidationSchema
} from '../../../helpers';
import Alert from '../../reusable/Alert';
import FormSubmitButton from '../../styled/FormSubmitButton';
import FormCard from '../../styled/FomCard';
import Div from '../../styled/Div';
import FormInputPassword from '../../styled/FomInputPassword';
import ValidationText from '../../styled/ValidationText';

// Component
export default function NewPasswordForm(props: UserIdWithToken) {
  const dispatch = useDispatch();
  const { userId, token } = props;
  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');

  const [
    serverSideResponse,
    setServerSideResponse
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [resetRender, setResetRender] = useState<boolean>(false);

  const formOptions = {
    resolver: yupResolver(resetPasswordTokenValidationSchema)
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset
  } = useForm<any>(formOptions);

  function onSubmit(data: NewPassword) {
    setResetRender(true); // Reset the rendering behavior
    dispatch(showAuthFormOverlay({ authFormOverlay: true })); // Enable formOverlay to prevent any click during form submission

    return authService
      .newPassword({
        userId,
        token,
        newPassword: data.newPassword
      })
      .then(function(response) {
        setAlertColor('success');
        setResetRender(false); // Reset the rendering behavior
        setServerSideResponse(response);
        reset({ newPassword: '' });
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      })
      .catch(function(error) {
        setAlertColor('danger');
        setResetRender(false); // Reset the rendering behavior
        setServerSideResponse(error);
        displayServerSideErrors(getServerValidationErrors(error));
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      });
  }

  // displayServerSideError function
  // The backend server is returning all the password message errors
  // in an array but we have to show only one on the UI which will be the
  // first.
  function displayServerSideErrors(errors: ServerErrorField[]) {
    if (Array.isArray(errors) && errors.length > 0) {
      setError(errors[0].param as any, { message: errors[0].msg }); // setError coming from react-hook-form
    }
  }

  return (
    <Fragment>
      {serverSideResponse?.message && !resetRender && (
        <Alert color={alertColor}>{serverSideResponse.message}</Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard>
          <div>
            <NewPasswordForm.Text>Reset password</NewPasswordForm.Text>
            <NewPasswordForm.Description>
              Enter your new password and make sure your password will be strong
              which contain atleast one capital letter and one number and one
              special character.
            </NewPasswordForm.Description>
          </div>

          <Div $marginBottom={24}>
            <FormInputPassword
              RHFRef={{ ...register('newPassword') }}
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              autoComplete="off"
              $invalid={errors?.newPassword && true}
            />

            {errors.newPassword?.message && (
              <ValidationText>{errors.newPassword?.message}</ValidationText>
            )}
          </Div>

          <NewPasswordForm.WrapperWidth>
            <NewPasswordForm.Button
              text="Reset Password"
              disabled={isSubmitting}
            />
          </NewPasswordForm.WrapperWidth>
        </FormCard>
      </form>
    </Fragment>
  );
}

// Styled
NewPasswordForm.Text = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: ${rem(20)};
  font-weight: 600;
  color: #000;
  margin-bottom: ${rem(24)};
`;

NewPasswordForm.Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: ${rem(16)};
  font-weight: 400;
  color: #000;
  margin-bottom: ${rem(24)};
`;

NewPasswordForm.WrapperWidth = styled.div`
  width: ${rem(370)};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${rem(40)};
`;

NewPasswordForm.Button = styled(FormSubmitButton)`
  & {
    width: 100%;
    display: block;
    padding: ${rem(14)} ${rem(48)};
  }
`;
