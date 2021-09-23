import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import styled from 'styled-components';

import { Country } from '../../types';
import { countries } from '../../constants';
import { AuthFormInputStyles } from '../../styles/reuse';
import { CountryIcon } from '../../svgs';
import { getIsoCode3ByCountryName } from '../../helpers';

// Props
type Props = {
  onCountryValueChanger: (code: string) => void;
  [prop: string]: any;
};

// Components
// By default this component uses an HTML Mark Text element (<strong>) to wrap matched text.
function Highlight(props: any) {
  const { children } = props;
  return <strong>{children}</strong>;
}

// Main component
export default function FormInputCountry(props: Props) {
  const { onCountryValueChanger, ...attrs } = props;

  // ------------------ MaterialUI States -------------------
  const [val, setVal] = useState<Country | null>(null);
  const [inputVal, setInputVal] = useState<string>('');
  // ------------------ End - MaterialUI States -------------------

  const [isOpen, setIsOpen] = useState<boolean>(false);

  function onInputChange(event: React.ChangeEvent<{}>, newInputValue: string) {
    setInputVal(newInputValue);
    if (newInputValue.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  function onChange(event: React.ChangeEvent<{}>, value: Country | null) {
    if (value) {
      setVal(value);
      onCountryValueChanger(getIsoCode3ByCountryName(value.name)); // Pass the country name to get the code
    }
  }

  // useAutocomplete
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue
  } = useAutocomplete({
    value: val, // set the default assign "country object" state to the "value"
    inputValue: inputVal, // get updated input text as a string from the state
    id: attrs?.id ? attrs.id : 'country',
    options: countries,
    autoComplete: true,
    open: isOpen, // Manually control with a boolean state
    onClose: () => setIsOpen(false), // Manually control
    onInputChange: onInputChange, // get latest newInputValue text as a string
    onChange: onChange, // assign "country object" to the "value" state
    getOptionLabel: option => option.name,
    getOptionSelected: option => option.name === val?.name
  });

  return (
    <FormInputCountry.Wrapper {...getRootProps()}>
      <FormInputCountry.Input type="text" {...getInputProps()} {...attrs} />
      <FormInputCountry.Icon>
        <CountryIcon />
      </FormInputCountry.Icon>

      {groupedOptions.length > 0 && (
        <FormInputCountry.ListBox {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            const HighlighterJSX = (
              <Highlighter
                searchWords={[inputValue]}
                autoEscape={true}
                textToHighlight={option.name}
                highlightTag={Highlight}
              />
            );
            return (
              <FormInputCountry.Option
                key={`index-${index}`}
                {...getOptionProps({ option, index })}
              >
                {HighlighterJSX}
              </FormInputCountry.Option>
            );
          })}
        </FormInputCountry.ListBox>
      )}
    </FormInputCountry.Wrapper>
  );
}

// Styles
FormInputCountry.Wrapper = styled.div`
  position: relative;
`;

FormInputCountry.Input = styled.input<{ $invalid?: boolean }>`
  ${AuthFormInputStyles};
  & {
    padding-left: 48px;
  }
`;

FormInputCountry.Icon = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  padding: 4px;
  left: 12px;
  top: 0;
  bottom: 0;

  > svg {
    width: 18px;
    height: 18px;
  }
`;

// Menu
FormInputCountry.ListBox = styled.ul`
  width: 100%;
  max-height: 162px;
  overflow-y: auto;
  margin-top: 8px;
  border: 1px solid #d8d8d8;
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

FormInputCountry.Option = styled.li`
  font-weight: 400;
  color: #000;
  padding: 8px 14px;
  cursor: pointer;

  &[data-focus='true'] {
    background-color: #f3f3f3;
  }
`;
