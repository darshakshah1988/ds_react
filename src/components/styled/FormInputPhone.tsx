import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useSelect, UseSelectStateChange } from 'downshift';

import { getPhoneCodesWithNames, getSanitizePhoneCode } from '../../helpers';
import { ChevronDown, PhoneIcon } from '../../svgs';

// Get phone code list
const items = getPhoneCodesWithNames();

// Custom DropdownMenu for forwarding ref
// eslint-disable-next-line react/display-name
const DropdownMenu = React.forwardRef<any>((props, ref: any) => {
  return <FormInputPhone.Menu ref={ref} {...props} />;
});

// Types
type Props = {
  RHFRef: any;
  invalid?: boolean | undefined;
  onPhoneValueChanger: (phone: string) => void;
  value: string;
  [index: string]: any;
};

// Component
export default function FormInputPhone(props: Props) {
  const {
    RHFRef,
    invalid,
    onPhoneValueChanger,
    value,
    style,
    ...attrs
  } = props;

  function handleSelectedItemChange(changes: UseSelectStateChange<string>) {
    const { selectedItem } = changes;
    onPhoneValueChanger(getSanitizePhoneCode(selectedItem || ''));
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps
  } = useSelect({
    id: 'phone-code-switcher',
    items,
    selectedItem: value,
    onSelectedItemChange: handleSelectedItemChange
  });

  const menuStyles = {
    marginTop: isOpen ? '8px' : 0,
    border: isOpen ? '1px solid #d8d8d8' : 0
  };

  return (
    <Fragment>
      <FormInputPhone.InputGroup>
        {/* ============= Prepend ============= */}
        <FormInputPhone.InputGroupPrepend>
          {/* ============= Icon ============= */}
          <FormInputPhone.InputGroupIcon>
            <PhoneIcon />
          </FormInputPhone.InputGroupIcon>
          {/* ============= Icon ============= */}

          {/* ============= Dropdown ============= */}
          <FormInputPhone.Box>
            <label {...getLabelProps()} aria-label="Phone code Switcher" />
            <FormInputPhone.Button type="button" {...getToggleButtonProps()}>
              <FormInputPhone.ButtonValue>
                {value || ''}
              </FormInputPhone.ButtonValue>
              <FormInputPhone.ButtonSvg>
                <ChevronDown />
              </FormInputPhone.ButtonSvg>
              <span>|</span>
            </FormInputPhone.Button>

            <DropdownMenu {...getMenuProps({ style: menuStyles })}>
              {isOpen &&
                items.map((item, index) => (
                  <FormInputPhone.MenuItem
                    style={
                      highlightedIndex === index
                        ? { backgroundColor: '#f3f3f3' }
                        : {}
                    }
                    key={`${item}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    {item}
                  </FormInputPhone.MenuItem>
                ))}
            </DropdownMenu>
          </FormInputPhone.Box>
          {/* ============= End - Dropdown ============= */}
        </FormInputPhone.InputGroupPrepend>
        {/* ============= End - Prepend ============= */}

        <FormInputPhone.Input
          type="tel"
          $invalid={invalid}
          {...attrs}
          {...RHFRef}
        />
      </FormInputPhone.InputGroup>
    </Fragment>
  );
}

// Styles
FormInputPhone.InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
`;
FormInputPhone.InputGroupPrepend = styled.div`
  margin-right: -1px;
  display: flex;
`;

FormInputPhone.InputGroupIcon = styled.span`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  margin-bottom: 0;
  border: 1px solid #d8d8d8;
  border-radius: 5px;
  & {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0;
  }
`;

// ============= Dropdown =============
FormInputPhone.Box = styled.div`
  display: flex;
  margin-left: -1px;
`;

FormInputPhone.Button = styled.button`
  display: inline-flex;
  align-items: center;

  background-color: transparent;

  color: #000;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};
  font-size: 1rem;
  font-weight: 500;

  border: 1px solid #d8d8d8;
  padding: 4px;
  user-select: none;

  &:focus {
    outline: 0;
  }

  & {
    position: relative;
    z-index: 2;
  }

  & {
    border-left-width: 0;
    border-right-width: 0;
  }
`;

FormInputPhone.ButtonValue = styled.span``;

FormInputPhone.ButtonSvg = styled.span`
  > svg {
    width: 8px;
    height: 8px;
    margin: 0 8px;
  }
`;

FormInputPhone.Menu = styled.ul`
  width: 100%;
  max-height: 162px;
  overflow-y: auto;
  margin: 0;
  background: #fff;
  position: absolute;
  z-index: 1000;
  list-style: none;
  top: 100%;
  left: 0;
  padding: 0;

  &:focus {
    outline: 0;
  }
`;

FormInputPhone.MenuItem = styled.li`
  font-weight: 400;
  color: #000;
  padding: 8px 14px;
  cursor: pointer;
`;

// ============= End - Dropdown =============
FormInputPhone.Input = styled.input<{ $invalid?: boolean }>`
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

  &:focus {
    outline: 0;
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

  & {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
    margin-bottom: 0;
  }

  & {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left-width: 0;
  }
`;
