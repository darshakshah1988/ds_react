import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cookie from 'js-cookie';

import {
  AlertColorType,
  EditUserPassword,
  ServerErrorField,
  ServerResponseMessageStatus
} from '../../types';
import { userService } from '../../services';
import { useState } from 'react';
import Alert from '../reusable/Alert';
import {
  getServerValidationErrors,
  userNewPasswordValidationSchema
} from '../../helpers';

export default function EditUserPasswordForm() {
  const formOptions = {
    resolver: yupResolver(userNewPasswordValidationSchema)
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset
  } = useForm<any>(formOptions);

  const [alertColor, setAlertColor] = useState<AlertColorType>('danger');
  const [resetRender, setResetRender] = useState<boolean>(false);

  const [
    serverSideResponse,
    setServerSideResponse
  ] = useState<ServerResponseMessageStatus | null>(null);

  function onSubmit(data: EditUserPassword) {
    const token = cookie.get('token'); // Get the Auth token
    setResetRender(true); // Reset the rendering behavior

    if (token) {
      return userService
        .editPassword({
          ...data,
          token
        })
        .then(function(response) {
          setAlertColor('success');
          setResetRender(false);
          setServerSideResponse(response);

          reset({ oldPassword: '', newPassword: '' }); // Reset the form
        })
        .catch(function(error) {
          setAlertColor('danger');
          setResetRender(false);
          setServerSideResponse(error);

          displayServerSideErrors(getServerValidationErrors(error)); // show password related errors
        });
    }
  }

  // displayServerSideErrors function
  function displayServerSideErrors(errors: ServerErrorField[]) {
    if (Array.isArray(errors) && errors.length > 0) {
      errors.forEach(error => {
        setError(error.param as any, { message: error.msg }); // setError coming from react-hook-form
      });
    }
  }

  return (
    <>
      {serverSideResponse?.message && !resetRender && (
        <Alert color={alertColor}>{serverSideResponse.message}</Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="oldPassword">Enter Old Password</label>
          <input
            {...register('oldPassword')}
            type="password"
            placeholder="Enter Old Password"
            autoComplete="off"
          />
          {errors.oldPassword?.message && (
            <small style={{ color: 'red', display: 'block' }}>
              {errors.oldPassword?.message}
            </small>
          )}
        </div>

        <div>
          <label htmlFor="newPassword">Enter New Password</label>
          <input
            {...register('newPassword')}
            type="password"
            placeholder="Enter New Password"
            autoComplete="off"
          />
          {errors.newPassword?.message && (
            <small style={{ color: 'red', display: 'block', width: '240px' }}>
              {errors.newPassword?.message}
            </small>
          )}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Save Password
          </button>
        </div>
      </form>
    </>
  );
}
