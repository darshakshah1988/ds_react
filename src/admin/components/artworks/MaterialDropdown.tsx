import { Fragment } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { useSelect, UseSelectStateChange } from 'downshift';
import { Controller, UseFormSetValue } from 'react-hook-form';

import { ChevronDown } from '../../../svgs';

// Types
type Props = {
  id: string; // id of material should be unique
  items: Array<string>; // Default Array of string that will show on the dropdown
  control: any; // This object contains methods for registering external components into RHF.
  name: string; // Name of the field which you want to register with RHF.
  setValue: UseFormSetValue<any>; // This RHF function allows us to dynamically set the value of a registered field.
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean | undefined;
};

// Material => Component
export default function MaterialDropdown(props: Props) {
  const {
    id,
    items,
    control,
    name,
    setValue,
    defaultValue,
    disabled,
    invalid
  } = props;

  function handleSelectedItemChange(changes: UseSelectStateChange<string>) {
    const { selectedItem } = changes;
    setValue(name, selectedItem, { shouldValidate: true });
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps
  } = useSelect({
    id: id,
    items: items,
    selectedItem: defaultValue,
    onSelectedItemChange: handleSelectedItemChange
  });

  const menuStyles = {
    marginTop: isOpen ? '4px' : 0,
    boxShadow: isOpen ? ' 0 4px 4px rgba(0, 0, 0, 0.25)' : 'none'
  };

  return (
    <Fragment>
      <Controller
        control={control}
        name={name}
        render={controllerProps => {
          const {
            field: { value = defaultValue }
          } = controllerProps;

          return (
            <MaterialDropdown.Box>
              <label
                {...getLabelProps({ style: { display: 'none' } })}
                aria-label="Material Dropdown"
              />

              {/* Button */}
              <MaterialDropdown.Button
                type="button"
                disabled={disabled}
                $invalid={invalid}
                {...getToggleButtonProps()}
              >
                <span>{!disabled && value ? value : 'Choose Material'}</span>
                <ChevronDown />
              </MaterialDropdown.Button>
              {/* End - Button */}

              {/* Dropdown */}
              <MaterialDropdown.Menu {...getMenuProps({ style: menuStyles })}>
                {isOpen &&
                  !disabled &&
                  items.map((item, index) => (
                    <MaterialDropdown.MenuItem
                      style={
                        highlightedIndex === index
                          ? { backgroundColor: '#f3f3f3' }
                          : {}
                      }
                      key={`${item}${index}`}
                      {...getItemProps({ item, index })}
                    >
                      <MaterialDropdown.ItemContent>
                        <span>{item}</span>
                        {value && item.includes(value) ? <CheckIcon /> : null}
                      </MaterialDropdown.ItemContent>
                    </MaterialDropdown.MenuItem>
                  ))}
              </MaterialDropdown.Menu>
              {/* End - Dropdown */}
            </MaterialDropdown.Box>
          );
        }}
      />
    </Fragment>
  );
}

//
// ============= StylesDropdown =============
MaterialDropdown.Box = styled.div`
  position: relative;
`;

MaterialDropdown.Button = styled.button<{ $invalid?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  background-color: transparent;

  color: #656565;
  font-size: 14px;
  font-weight: 500;

  border: 1px solid #c5c5c5;
  border-radius: 5px;

  padding: ${rem(10)} ${rem(12)};
  user-select: none;

  &:focus {
    outline: 0;
  }

  > svg {
    width: 10px;
    height: 10px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Invalid styles */
  ${props => {
    const { $invalid } = props;
    if ($invalid) {
      return css`
        && {
          border-color: #dc3545;
        }
      `;
    } else {
      return css``;
    }
  }}
`;

MaterialDropdown.Menu = styled.ul`
  width: 100%;
  max-height: 196px;
  overflow-y: auto;
  margin: 0;
  background: #fff;
  position: absolute;
  z-index: 1000;
  list-style: none;
  top: 100%;
  left: 0;
  padding: 0;
  border-radius: 5px;

  &:focus {
    outline: 0;
  }
`;

MaterialDropdown.MenuItem = styled.li``;

MaterialDropdown.ItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rem(14)};
  cursor: pointer;
  user-select: none;
  > span {
    color: #272b2f;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  > svg {
    width: 16px;
    height: 16px;
  }
`;

// ============= End - StylesDropdown =============

// Component
function CheckIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="#1BB964"
        d="M6.222 14.222a.888.888 0 01-.628-.26L.26 8.629a.889.889 0 011.257-1.257l4.645 4.645 8.266-9.919a.89.89 0 011.367 1.138l-8.89 10.667a.89.89 0 01-.642.319h-.041z"
      />
    </svg>
  );
}
