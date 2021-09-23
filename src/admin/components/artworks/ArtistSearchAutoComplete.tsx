import React, { Fragment, useState, useEffect, useRef } from 'react';
import { rem } from 'polished';
import Highlighter from 'react-highlight-words';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import throttle from 'lodash/throttle';
import escapeRegExp from 'lodash/escapeRegExp';
import { Controller, UseFormSetValue } from 'react-hook-form';
import styled from 'styled-components';

import { artistService } from '../../../services';
import { AdminFormInputStyles } from '../../styles/reuse';
import AdminFormInput from '../styled/AdminFormInput';
import Spinner from '../../../components/reusable/Spinner';

// Types
type Props = {
  labelText: string;
  placeholder: string;
  getArtistId: (artistId: string) => void;
  control: any; // This object contains methods for registering external components into RHF.
  name: string; // Name of the field which you want to register with RHF.
  setValue: UseFormSetValue<any>; // This RHF function allows us to dynamically set the value of a registered field.
  defaultValue?: ArtistType | null;
  invalid?: boolean | undefined;
};

type ArtistType = {
  name: string;
  [property: string]: any;
};

// Components
// By default this component uses an HTML Mark Text element (<strong>) to wrap matched text.
function Highlight(props: any) {
  const { children } = props;
  return <strong>{children}</strong>;
}

// Main component
export default function ArtistSearchAutoComplete(props: Props) {
  const {
    labelText,
    placeholder,
    getArtistId,
    control,
    name,
    setValue,
    defaultValue,
    invalid
  } = props;

  const defaultValueSet = useRef<any>(null);

  // ------------------ MaterialUI States -------------------
  const [val, setVal] = useState<ArtistType | null>(defaultValue || null);

  const [inputVal, setInputVal] = useState<string>('');

  const [options, setOptions] = useState<ArtistType[]>([]); // Here we dynamically store the results

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // ------------------ End - MaterialUI States -------------------

  // ✅ Save "ArtistType object" inside the "val" state
  function onChange(event: any, newValue: ArtistType | null) {
    if (newValue) {
      setOptions(newValue ? [newValue, ...options] : options);
      setVal(newValue); // Update the input value

      // Update react hook form state with selected artist name
      setValue(name, newValue.name, { shouldValidate: true });
      getArtistId(newValue._id);
    }
  }

  // ✅ Callback fired when the input value changes
  function onInputChange(event: any, newInputValue: string) {
    if (defaultValueSet.current) {
      setValue(name, '', { shouldValidate: true });
      getArtistId('');

      setInputVal(newInputValue); // Update new inputValue

      // Update the RHF value
      if (newInputValue.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      // Only run if there is defaultValue
    } else {
      if (defaultValue) {
        setValue(name, defaultValue.name, { shouldValidate: true });
        getArtistId(defaultValue._id);
      }
    }
  }

  // ✅ useAutocomplete
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: 'artist-auto-complete',
    getOptionLabel: option => option.name,
    // getOptionSelected: option => option.name === val?.name,
    filterOptions: x => x, // Disable the built-in filtering of the Autocomplete component by overriding the filterOptions prop
    options: options,
    autoComplete: true,
    clearOnBlur: false,
    includeInputInList: true, // If true, the highlight can move to the input.
    filterSelectedOptions: true, // If true, hide the selected options from the list box.
    value: val, // set the default assign "Artist object" state to the "value"
    onChange: onChange, // Callback fired when the value changes & right time to assign "option/new options object" to the second parameter of this function
    onInputChange: onInputChange, // Callback fired when the input value changes & get latest newInputValue text as a string
    open: isOpen, // Manually control with a boolean state
    onClose: () => setIsOpen(false) // Manually control
  });

  // ✅  Fetch Artist by name function
  //  On each keystroke and using the current value of the textbox to filter
  //  on the server, we have to consider throttling requests.
  const fetch = React.useMemo(
    () =>
      throttle(
        (
          keyStroke: string,
          callback: (results?: readonly ArtistType[]) => void
        ) => {
          // Before making network call show loading indicator
          setLoading(true);
          // Network call
          artistService
            .getFreeSearchArtists({
              page: 1,
              limit: 100000000000000000,
              sort: {},
              filter: escapeRegExp(keyStroke)
            })
            .then(function(response) {
              if (response?.data && response?.data.artists) {
                callback(response?.data.artists); // Return the results
                setLoading(false);
              }
            })
            .catch(function(error) {
              callback([]);
              setLoading(false);
            });
        },
        200
      ),
    []
  );

  // ✅  Hook: 1 - Whenever the state "val" and "inputVal" will be changed this will trigger.
  useEffect(() => {
    let active = true;
    if (defaultValueSet.current) {
      // Exit if

      // Exit if inputValue is empty
      if (inputVal === '') {
        setOptions(val ? [val] : []);
        return undefined;
      }

      // Invoke our fetch method, and we are passing keystroke in first parameter
      // In second parameter we are passing callback
      fetch(inputVal, (results?: readonly ArtistType[]) => {
        if (active) {
          let newOptions: ArtistType[] = [];

          // The value of the autocomplete which is assign "option object" state to the "value"
          if (val) {
            newOptions = [val];
          }

          // If there ae results assign to variable which will be update our option
          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      });
    }
    return () => {
      active = false;
    };
  }, [val, inputVal, fetch]);

  // ✅  Hook: 2 - Check if default value is set
  useEffect(() => {
    defaultValueSet.current = true;
  }, []);

  return (
    <Fragment>
      <Controller
        control={control}
        name={name}
        render={_ => {
          return (
            <ArtistSearchAutoComplete.Wrapper {...getRootProps()}>
              {/* Label */}
              <AdminFormInput.Label htmlFor="artist-auto-complete">
                {labelText}
              </AdminFormInput.Label>
              {/* End - Label */}

              <ArtistSearchAutoComplete.InputWrapper>
                <ArtistSearchAutoComplete.Input
                  type="text"
                  placeholder={placeholder}
                  $invalid={invalid}
                  {...getInputProps()}
                />
                {/*
                {loading ? (
                  <span>
                    <Spinner />
                  </span>
                ) : null}*/}
              </ArtistSearchAutoComplete.InputWrapper>

              {groupedOptions.length > 0 && (
                <ArtistSearchAutoComplete.ListBox {...getListboxProps()}>
                  {groupedOptions.map((option, index) => {
                    const HighlighterJSX = (
                      <Highlighter
                        searchWords={[inputVal]}
                        autoEscape={true}
                        textToHighlight={option.name}
                        highlightTag={Highlight}
                      />
                    );
                    return (
                      <ArtistSearchAutoComplete.Option
                        key={`index-${index}`}
                        {...getOptionProps({ option, index })}
                      >
                        {HighlighterJSX}
                      </ArtistSearchAutoComplete.Option>
                    );
                  })}
                </ArtistSearchAutoComplete.ListBox>
              )}
            </ArtistSearchAutoComplete.Wrapper>
          );
        }}
      />
    </Fragment>
  );
}

// Styles
ArtistSearchAutoComplete.Wrapper = styled.div`
  position: relative;
`;

ArtistSearchAutoComplete.Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  margin-bottom: ${rem(8)};
  user-select: none;
`;

// Input
ArtistSearchAutoComplete.InputWrapper = styled.div`
  position: relative;

  > input {
    padding-right: ${rem(40)};
  }

  > span {
    position: absolute;
    display: inline-flex;
    align-items: center;
    top: 0;
    bottom: 0;
    right: 14px;
    left: auto;
    color: #333;
  }
`;

ArtistSearchAutoComplete.Input = styled.input<{ $invalid?: boolean }>`
  ${AdminFormInputStyles};
`;

// Menu
ArtistSearchAutoComplete.ListBox = styled.ul`
  width: 100%;
  max-height: 204px;
  overflow-y: auto;
  margin-top: 4px;
  background: #fff;
  position: absolute;
  z-index: 1000;
  list-style: none;
  top: 100%;
  left: 0;
  padding: 0;
  border-radius: 5px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  &:focus {
    outline: 0;
  }
`;

ArtistSearchAutoComplete.Option = styled.li`
  font-weight: 400;
  color: #000;
  padding: 8px 14px;
  cursor: pointer;

  &[data-focus='true'] {
    background-color: #eee;
  }
`;
