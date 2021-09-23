import React, { Fragment } from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { rem } from 'polished';

import { DatePickerStyles } from '../../styles/vendor/react-datepicker';

// Types
type Props = {
  id: string;
  control: any;
  labelText?: string;
  label?: boolean;
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
  onSelectDate?: (date: Date | null | undefined) => void;
  invalid?: boolean | undefined;
};

// Component Note:
// You can't set default date on this component because this
// component is bind to RHF and you have to manually use the "setValue"
// function from the parent component
export default function AdminFormDateInput(props: Props) {
  const {
    control,
    id,
    label,
    labelText,
    minDate,
    maxDate,
    onSelectDate,
    invalid
  } = props;

  function onChangeHandler(date: any) {
    if (onSelectDate) {
      return onSelectDate(date || null);
    }
  }

  // Check if there is default date

  return (
    <Fragment>
      <Controller
        control={control}
        name={id}
        render={controllerProps => {
          const { field } = controllerProps;
          const { onChange, value } = field;

          // It seems if date is in string format. Datepicker don't accept string date.
          // We need to parse the string date to actual date object
          const newValue =
            typeof value === 'string' && value.length > 0
              ? new Date(value)
              : value;

          return (
            <AdminFormDateInput.DatePickerStyles>
              {label ? (
                <AdminFormDateInput.Label htmlFor={id}>
                  {labelText}
                </AdminFormDateInput.Label>
              ) : null}
              <DatePicker
                id={id}
                showPopperArrow={false}
                onChange={date => {
                  onChange(date);
                  onChangeHandler(date);
                }}
                selected={newValue || null}
                wrapperClassName="date-wrapper"
                className="date-control"
                autoComplete="off"
                minDate={minDate || null}
                maxDate={maxDate || null}
              />
            </AdminFormDateInput.DatePickerStyles>
          );
        }}
      />
    </Fragment>
  );
}

AdminFormDateInput.Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #718898;
  margin-bottom: ${rem(8)};
`;

AdminFormDateInput.DatePickerStyles = styled.div`
  ${DatePickerStyles};
`;
