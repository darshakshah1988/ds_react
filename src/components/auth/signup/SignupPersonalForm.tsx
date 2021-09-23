import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import { showAuthFormOverlay } from '../../../redux/slices/layoutSlice';
import { authService } from '../../../services';
import {
  SignupUserPersonal,
  ServerResponseMessageStatus,
  ServerErrorField
} from '../../../types';

import {
  signupPersonalValidationSchema,
  getServerValidationErrors
} from '../../../helpers';
import Alert from '../../reusable/Alert';
import { EmailIcon, LoginIcon, UserNameIcon } from '../../../svgs';

import Div from '../../styled/Div';
import ValidationText from '../../styled/ValidationText';
import FormCard from '../../styled/FomCard';
import FormInput from '../../styled/FormInput';
import FormInputPhone from '../../styled/FormInputPhone';
import FormInputPassword from '../../styled/FomInputPassword';
import RenderSubmitButtonWrapper from '../../styled/RenderSubmitButtonWrapper';

// Vars
const DEFAULT_PHONE_CODE_SELECTED = '+65';

const initialValues = {
  accountType: 'PERSONAL',
  contactNo: ''
};

// Component
export default function SignupPersonalForm() {
  const dispatch = useDispatch();

  const [defaultPhone, setDefaultPhone] = useState<string>(
    DEFAULT_PHONE_CODE_SELECTED
  );

  const [
    serverSideSuccess,
    setServerSideSuccess
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [resetRender, setResetRender] = useState<boolean>(false);

  const formOptions = {
    defaultValues: initialValues,
    resolver: yupResolver(signupPersonalValidationSchema)
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset
  } = useForm<any>(formOptions);

  // onSubmit function
  function onSubmit(data: SignupUserPersonal) {
    const modify = { ...data, contactNo: `${defaultPhone}${data.contactNo}` };
    setResetRender(true); // Reset the rendering behavior
    dispatch(showAuthFormOverlay({ authFormOverlay: true })); // Enable formOverlay to prevent any click during form submission

    return authService
      .signupPersonal(modify)
      .then(function(response) {
        setResetRender(false);
        setServerSideSuccess(response);

        reset(formOptions.defaultValues); // Reset the form
        setDefaultPhone(DEFAULT_PHONE_CODE_SELECTED); // Reset the phone selection state
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      })
      .catch(function(error) {
        displayServerSideErrors(getServerValidationErrors(error));
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      });
  }

  // phoneValueChanger function
  function phoneValueChanger(phoneCode: string) {
    setDefaultPhone(phoneCode); // Update the state according to phone code selection
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
    <Fragment>
      {serverSideSuccess?.message && !resetRender ? (
        <Alert color="success">{serverSideSuccess.message}</Alert>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard>
          <Div $marginBottom={24}>
            <FormInput
              RHFRef={{ ...register('userName') }}
              icon={<UserNameIcon />}
              id="userName"
              type="text"
              placeholder="Enter Username"
              autoComplete="off"
              $invalid={errors?.userName && true}
            />
            {errors.userName?.message && (
              <ValidationText>{errors.userName?.message}</ValidationText>
            )}
          </Div>

          <Div $marginBottom={24}>
            <FormInput
              RHFRef={{ ...register('email') }}
              icon={<EmailIcon />}
              id="email"
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              $invalid={errors?.email && true}
            />
            {errors.email?.message && (
              <ValidationText>{errors.email?.message}</ValidationText>
            )}
          </Div>

          <Div $marginBottom={24}>
            <FormInputPhone
              RHFRef={{ ...register('contactNo') }}
              onPhoneValueChanger={phoneValueChanger}
              value={defaultPhone}
              placeholder="Enter phone number"
              autoComplete="off"
            />
          </Div>

          <Div $marginBottom={24}>
            <FormInputPassword
              RHFRef={{ ...register('password') }}
              id="password"
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              $invalid={errors?.password && true}
            />

            {errors.password?.message && (
              <ValidationText>{errors.password?.message}</ValidationText>
            )}
          </Div>
        </FormCard>

        {/* ============= TextWrapper ============= */}
        <RenderSubmitButtonWrapper
          attachTextWithLink="Already have an account?"
          linkPath="/signin"
          linkText="Sign in"
          buttonDisable={isSubmitting}
          buttonIcon={<LoginIcon />}
          buttonText="Register"
        />
        {/* ============= End - TextWrapper ============= */}
      </form>
    </Fragment>
  );
}
