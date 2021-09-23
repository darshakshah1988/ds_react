import { useState, Fragment } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { rem } from 'polished';

import { AccountType } from '../../../types';
import SignupPersonalForm from './SignupPersonalForm';
import SignupCompanyForm from './SignupCompanyForm';

// Component
export default function SignupTabs() {
  const [activeTab, setActiveTab] = useState<AccountType>('PERSONAL');

  const toggle = (tab: AccountType) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // Dynamic class will be automatically added based on state change.
  const containerCls = classNames(
    { 'sw-left': activeTab === 'PERSONAL' },
    { 'sw-right': activeTab === 'COMPANY' }
  );

  return (
    <Fragment>
      {/* ============= Tabs ============= */}
      <SignupTabs.Wrapper>
        <SignupTabs.Nav role="tablist" className={containerCls}>
          <SignupTabs.NavLink
            className={activeTab === 'PERSONAL' ? 'active' : ''}
            role="tab"
            aria-controls="personal"
            aria-selected={activeTab === 'PERSONAL' ? 'true' : 'false'}
            onClick={() => {
              toggle('PERSONAL');
            }}
          >
            Personal
          </SignupTabs.NavLink>

          <SignupTabs.NavLink
            className={activeTab === 'COMPANY' ? 'active' : ''}
            role="tab"
            aria-controls="company"
            aria-selected={activeTab === 'COMPANY' ? 'true' : 'false'}
            onClick={() => {
              toggle('COMPANY');
            }}
          >
            Company
          </SignupTabs.NavLink>
        </SignupTabs.Nav>
      </SignupTabs.Wrapper>
      {/* ============= End - Tabs ============= */}
      <SignupTabs.TabContent>
        {activeTab === 'PERSONAL' && (
          <div role="tabpanel" aria-labelledby="personal-tab">
            <SignupPersonalForm />
          </div>
        )}
        {activeTab === 'COMPANY' && (
          <div role="tabpanel" aria-labelledby="company-tab">
            <SignupCompanyForm />
          </div>
        )}
      </SignupTabs.TabContent>
    </Fragment>
  );
}

// Styles
SignupTabs.Wrapper = styled.div`
  width: ${rem(360)};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${rem(24)};

  padding: ${rem(8)} ${rem(12)};
  background-color: #f9f9f9;
  border-radius: 0;
  @media (min-width: 450px) {
    border-radius: 9999px;
  }
`;

SignupTabs.Nav = styled.div`
  position: relative;

  /* Without Media Query */
  & > .active {
    color: #272b2f;
    background-color: #ffffff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 450px) {
    &:after {
      content: '';
      position: absolute;
      width: 50%;
      top: 0;

      left: 0;

      background-color: #ffffff;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);

      height: 100%;
      z-index: 0;
      border-radius: 9999px;

      transition: left ease-in-out 0.4s;
    }

    /* For the left tab. */
    &.sw-left:after {
      left: 0;
    }

    &.sw-left > .active {
      color: #272b2f;
      background-color: transparent;
      box-shadow: none;
    }

    /* For the right tab. */
    &.sw-right:after {
      left: 50%;
    }

    &.sw-right > .active {
      color: #272b2f;
      background-color: transparent;
      box-shadow: none;
    }
  }
`;

SignupTabs.NavLink = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: ${rem(10)} ${rem(48)};

  font-size: 1rem;
  font-weight: 500;

  color: #656565;

  width: 100%;

  user-select: none;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 1;
  transition: color 0.4s ease-in-out;

  @media (min-width: 450px) {
    display: inline-flex;
    flex-direction: row;
    width: 50%;
  }
`;

// TabContent
SignupTabs.TabContent = styled.div``;
