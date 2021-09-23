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
  Email,
  ServerResponseMessageStatus
} from '../../../types';
import { forgetPasswordValidationSchema } from '../../../helpers';
import Alert from '../../reusable/Alert';
import { EmailIcon } from '../../../svgs';

import Div from '../../styled/Div';
import FormCard from '../../styled/FomCard';
import FormInput from '../../styled/FormInput';
import FormSubmitButton from '../../styled/FormSubmitButton';

import ValidationText from '../../styled/ValidationText';

// Component
export default function ForgetPasswordForm() {
  const dispatch = useDispatch();

  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');
  const [resetRender, setResetRender] = useState<boolean>(false);

  const [
    serverSideResponse,
    setServerSideResponse
  ] = useState<ServerResponseMessageStatus | null>(null);

  const formOptions = {
    resolver: yupResolver(forgetPasswordValidationSchema)
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<any>(formOptions);

  function onSubmit(data: Email) {
    setResetRender(true); // Reset the rendering behavior
    dispatch(showAuthFormOverlay({ authFormOverlay: true })); // Enable formOverlay to prevent any click during form submission

    return authService
      .forgetPassword(data)
      .then(function(response) {
        setAlertColor('success');
        setResetRender(false);

        setServerSideResponse(response);
        reset({ email: '' });
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      })
      .catch(function(error) {
        setAlertColor('danger');
        setResetRender(false);

        setServerSideResponse(error);
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      });
  }

  return (
    <Fragment>
      {!resetRender && serverSideResponse?.message && (
        <Alert color={alertColor}>{serverSideResponse.message}</Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard>
          <div>
            <ForgetPasswordForm.Text>Forgot password</ForgetPasswordForm.Text>

            <ForgetPasswordForm.Description>
              Enter the email associated with your account and we’ll send an
              email with instructions to reset your password.
            </ForgetPasswordForm.Description>
          </div>

          <Div $marginBottom={24}>
            <FormInput
              RHFRef={{ ...register('email') }}
              icon={<EmailIcon />}
              id="email"
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              $invalid={errors?.email && true}
            />
            {errors.email?.message && (
              <ValidationText>{errors.email?.message}</ValidationText>
            )}
          </Div>

          <ForgetPasswordForm.WrapperWidth>
            <ForgetPasswordForm.Button
              text="Send Instructions"
              disabled={isSubmitting}
            />
          </ForgetPasswordForm.WrapperWidth>
        </FormCard>
      </form>
    </Fragment>
  );
}

// Styled
ForgetPasswordForm.Text = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: ${rem(20)};
  font-weight: 600;
  color: #000;
  margin-bottom: ${rem(24)};
`;

ForgetPasswordForm.Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: ${rem(16)};
  font-weight: 400;
  color: #000;
  margin-bottom: ${rem(24)};
`;

ForgetPasswordForm.WrapperWidth = styled.div`
  width: ${rem(370)};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${rem(40)};
`;

ForgetPasswordForm.Button = styled(FormSubmitButton)`
  & {
    width: 100%;
    display: block;
    padding: ${rem(14)} ${rem(48)};
  }
`;
