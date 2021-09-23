import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import { FilterDatePickerStyles } from './filter-react-datepicker-styles';

// Types
type Props = {
  id: string;
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
  placeholder?: string | undefined;
  onChange?: (date: Date | null | undefined) => void;
  styled?: FlattenSimpleInterpolation;
};

export default function FilterDateInput(props: Props) {
  const [date, setDate] = useState<any>(null);

  const { id, placeholder, minDate, maxDate, onChange, styled } = props;

  function onChangeHandler(date: any) {
    if (onChange) {
      onChange(date || null);
    }
  }

  return (
    <FilterDateInput.DatePickerStyles $styled={styled}>
      <DatePicker
        id={id}
        showPopperArrow={false}
        onChange={date => {
          onChangeHandler(date);
          setDate(date);
        }}
        selected={date || null}
        wrapperClassName="date-wrapper"
        className="date-control"
        autoComplete="off"
        minDate={minDate || null}
        maxDate={maxDate || null}
        placeholderText={placeholder}
      />
    </FilterDateInput.DatePickerStyles>
  );
}

FilterDateInput.DatePickerStyles = styled.div<{
  $styled?: FlattenSimpleInterpolation;
}>`
  ${FilterDatePickerStyles};

  ${props => {
    const { $styled } = props;
    if ($styled) {
      return css`
        & .date-control {
          ${$styled};
        }
      `;
    }
  }};
`;
