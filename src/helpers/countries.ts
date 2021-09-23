// This function will convert array of objects into an array of strings.
import { Country } from '../types';
import { countries } from '../constants';

export function getCountries(): Array<string> {
  return countries.map((country: Country) => country.name);
}

export function getPhoneCodes(): Array<string> {
  return countries.map((country: Country) => country.phone);
}

export function getPhoneCodesWithNames(): Array<string> {
  return countries.map(
    (country: Country) => `${country.name} - (${country.phone})`
  );
}

export function getSanitizePhoneCode(value: string): string {
  return `+${value.split('+')[1].replace(')', '')}`;
}

// This function will take the name of the country and return the iso code 3.
export function getIsoCode3ByCountryName(
  name: string | null | undefined
): string {
  if (name) {
    const found = countries.find((country: Country) => country.name === name);
    return found && found.code3 ? found.code3 : '';
  }
  return '';
}
