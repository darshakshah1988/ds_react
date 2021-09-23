import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { rem } from 'polished';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cookie from 'js-cookie';

import { showAuthFormOverlay } from '../../../redux/slices/layoutSlice';
import { setUser } from '../../../redux/slices/authSlice';
import { authService } from '../../../services';
import {
  SigninUser,
  ServerResponseMessageStatus,
  LoginSuccessType
} from '../../../types';
import { CLIENT_SIDE_RULES } from '../../../constants';
import { signinValidationSchema } from '../../../helpers';
import { getIdentifyUserName } from '../../../helpers';
import Alert from '../../reusable/Alert';
import ResendVerification from '../resend-verification/ResendVerification';

import {
  EmailIcon,
  GoogleIcon,
  FacebookIcon,
  KakaoIcon,
  LineIcon,
  LoginIcon
} from '../../../svgs';

import Div from '../../styled/Div';
import ValidationText from '../../styled/ValidationText';
import FormCard from '../../styled/FomCard';
import FormInput from '../../styled/FormInput';
import FormInputPassword from '../../styled/FomInputPassword';
import RenderSubmitButtonWrapper from '../../styled/RenderSubmitButtonWrapper';

// Vars
const initialValues = {
  email: '',
  password: ''
};

// Component
export default function SigninForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [saveResendEmail, setSaveResendEmail] = useState<string>(''); // Save last entered email
  const [buttonDisable, setButtonDisable] = useState<boolean>(false); // Manual control of button disabling

  const [
    serverSideResponse,
    setServerSideResponse
  ] = useState<ServerResponseMessageStatus | null>(null);

  const [serverSideSuccess, setServerSideSuccess] = useState<
    ServerResponseMessageStatus | LoginSuccessType | null
  >(null);

  const [resetRender, setResetRender] = useState<boolean>(false);

  const formOptions = {
    defaultValues: initialValues,
    resolver: yupResolver(signinValidationSchema)
  };

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset
  } = useForm<any>(formOptions);

  function onSubmit(data: SigninUser) {
    setResetRender(true); // Reset the rendering behavior
    setButtonDisable(true); // Disable the button
    dispatch(showAuthFormOverlay({ authFormOverlay: true })); // Enable formOverlay to prevent any click during form submission

    return authService
      .signin(data)
      .then(function(response) {
        //  If then() block executes, it means that the route will change.
        //  So please keep the button disabled.
        setServerSideResponse(null);
        setServerSideSuccess(response);

        if (response?.data && response.data.token && response.data.user) {
          const { token, user } = response.data;

          cookie.set('token', token, { expires: 1 }); // store the token in cookie and this cookie will expire after 1 day
          dispatch(setUser({ user })); // store user on the redux store

          const userName = getIdentifyUserName(user);
          router.push(`/users/${userName}`).then(function() {
            dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
          });
        }
      })
      .catch(function(error) {
        setSaveResendEmail(getValues('email'));

        setResetRender(false);
        setServerSideResponse(error);

        reset(formOptions.defaultValues);
        setButtonDisable(false);
        dispatch(showAuthFormOverlay({ authFormOverlay: false })); // Redux dispatch
      });
  }

  return (
    <Fragment>
      {!resetRender && getFreshJSXForAlert(serverSideResponse, saveResendEmail)}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormCard>
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

          <SigninForm.LinkWrap>
            <Link href="/forget-password" passHref>
              <SigninForm.Link>Forget Password?</SigninForm.Link>
            </Link>
          </SigninForm.LinkWrap>
        </FormCard>

        {/* ============= TextWrapper ============= */}
        <RenderSubmitButtonWrapper
          attachTextWithLink="Don’t have an account?"
          linkPath="/signup"
          linkText="Sign up"
          buttonDisable={buttonDisable}
          buttonIcon={<LoginIcon />}
          buttonText="Login"
        />
        {/* ============= End - TextWrapper ============= */}
      </form>

      {/* ============= Divider ============= */}
      <SigninForm.Divider />
      {/* ============= End - Divider ============= */}

      {/* ============= Group-1 ============= */}
      <SigninForm.LinkGroup>
        <SigninForm.GoogleLink href="https://www.google.com/" target="_blank">
          <GoogleIcon />
          <span>Google</span>
        </SigninForm.GoogleLink>

        <SigninForm.FacebookLink
          href="https://www.facebook.com/"
          target="_blank"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </SigninForm.FacebookLink>
      </SigninForm.LinkGroup>

      {/* ============= Group-2 ============= */}
      <SigninForm.LinkGroup>
        <SigninForm.KakaoLink
          href="https://kakaocorp.com/page/service/service/KakaoTalk/"
          target="_blank"
        >
          <KakaoIcon />
          <span>Kakao</span>
        </SigninForm.KakaoLink>

        <SigninForm.LineLink href="https://line.me/" target="_blank">
          <LineIcon />
          <span>Line</span>
        </SigninForm.LineLink>
      </SigninForm.LinkGroup>
    </Fragment>
  );
}

// A function that will render the JSX for the alert.
function getFreshJSXForAlert(
  error: ServerResponseMessageStatus | null,
  email: string
) {
  if (error?.message && error.message !== CLIENT_SIDE_RULES.LOGIN.MESSAGE_1) {
    return <Alert color="danger">{error.message}</Alert>;
  }
  if (error?.message && error.message === CLIENT_SIDE_RULES.LOGIN.MESSAGE_1) {
    return (
      <ResendVerification
        email={email || ''}
        verificationMessage={error.message}
      />
    );
  }
  return null;
}

// Styled
SigninForm.LinkWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

SigninForm.Link = styled.a`
  font-size: 18px;
  color: #3f51b5;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  text-decoration: underline;
`;

SigninForm.Divider = styled.div`
  position: relative;
  background-color: #f1f1f1;
  border: 0;
  height: 1px;
  margin: 48px 0;
  width: 100%;

  &:before {
    content: 'OR';

    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);

    border: 1px solid #f1f1f1;
    border-radius: 22px;

    font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
    font-size: 12px;
    font-weight: 500;
    color: #000;

    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    width: 56px;
    height: 22px;
    background-color: #fff;
  }
`;

// ============= LinkGroup =============
SigninForm.LinkGroup = styled.div`
  > a {
    margin-bottom: ${rem(12)};
  }

  @media (min-width: 576px) {
    align-items: stretch;
    display: flex;
    margin-bottom: ${rem(16)};

    > a {
      margin-bottom: 0;
    }

    > a:not(:last-child) {
      margin-bottom: 0;
      margin-right: ${rem(20)};
    }
  }
`;

const RepeatLinkStyles = css`
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 1rem;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  padding: ${rem(12)};

  border-radius: 42px;
  border: 1px solid #c4c4c4;
  background: #fff;
  color: #000;

  & > svg {
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }
`;

SigninForm.GoogleLink = styled.a`
  ${RepeatLinkStyles};
`;
SigninForm.FacebookLink = styled.a`
  ${RepeatLinkStyles};
`;
SigninForm.KakaoLink = styled.a`
  ${RepeatLinkStyles};
`;
SigninForm.LineLink = styled.a`
  ${RepeatLinkStyles};
`;
