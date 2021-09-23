import React from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { useSelect, UseSelectStateChange } from 'downshift';

import { ChevronDown } from '../../svgs';

// Items in the Dropdown
const items = ['InActive', 'Active'];

// Types
type Props = {
  value: string;
  onDropdownChanger: (behavior: string) => void;
  styled?: FlattenSimpleInterpolation;
};

// Component
export default function FilterActiveDropdown(props: Props) {
  const { value, styled, onDropdownChanger } = props;

  function handleSelectedItemChange(changes: UseSelectStateChange<string>) {
    const { selectedItem } = changes;
    onDropdownChanger(selectedItem || '');
  }

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps
  } = useSelect({
    id: 'filter-active-inactive',
    items,
    selectedItem: value,
    onSelectedItemChange: handleSelectedItemChange
  });

  const menuStyles = {
    opacity: 1,
    visibility: 'visible',
    transform: 'scale(1)',
    border: '1px solid #d8d8d8'
  };

  return (
    <FilterActiveDropdown.Box $styled={styled}>
      <FilterActiveDropdown.BoxContent>
        <label
          {...getLabelProps()}
          aria-label="Filter Active or InActive Dropdown"
        />

        {/* Button */}
        <FilterActiveDropdown.Button type="button" {...getToggleButtonProps()}>
          <span>{value || ''}</span>
          <ChevronDown />
        </FilterActiveDropdown.Button>

        {/* End - Button */}

        {/*  Dropdown */}
        <FilterActiveDropdown.DropdownMenu
          {...getMenuProps()}
          style={isOpen ? menuStyles : {}}
        >
          {isOpen &&
            items.map((item, index) => (
              <FilterActiveDropdown.MenuItem
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#f3f3f3' }
                    : {}
                }
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item}
              </FilterActiveDropdown.MenuItem>
            ))}
        </FilterActiveDropdown.DropdownMenu>
      </FilterActiveDropdown.BoxContent>
    </FilterActiveDropdown.Box>
  );
}

// Styles
FilterActiveDropdown.Box = styled.ul<{ $styled?: FlattenSimpleInterpolation }>`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  list-style: none;
  margin: 0;

  ${props => {
    const { $styled } = props;
    if ($styled) {
      return css`
        ${$styled};
      `;
    }
  }};
`;

FilterActiveDropdown.BoxContent = styled.li`
  position: relative;
  width: 100%;
`;

FilterActiveDropdown.Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  width: 100%;
  height: 100%;
  color: #8a92a6;
  font-size: 14px;
  font-weight: 400;

  border: 1px solid #eee;
  padding: 8px 12px;
  user-select: none;

  border-radius: 4px;

  &:focus {
    outline: 0;
  }

  > svg {
    color: #000;
    width: 8px;
    height: 8px;
  }
`;

// Dropdown
FilterActiveDropdown.DropdownMenu = styled.ul`
  width: 100%;
  max-height: 162px;
  overflow-y: auto;
  margin: 0;
  background: #fff;
  position: absolute;
  z-index: 1000;
  list-style: none;
  top: 100%;
  right: auto;
  left: 0;

  padding: 0;

  opacity: 0;
  visibility: hidden;
  transform-origin: top right;
  transform: scale(0.65);
  transition: visibility 0s, transform 0.1s cubic-bezier(0, 0, 0.2, 1),
    opacity 0.1s cubic-bezier(0, 0, 0.2, 1);

  &:focus {
    outline: 0;
  }
`;

FilterActiveDropdown.MenuItem = styled.li`
  font-size: 14px;
  font-weight: 400;
  color: #333;
  padding: 8px 14px;
  cursor: pointer;
`;

// ============= End - Dropdown =============
