import { capitalize } from 'lodash';

/**
 * Truncate string into specific length characters.
 * @param str {string} - The input string
 * @param n {number} - Total number of characters you want to include.
 * @returns {string} - Returns the string
 */
export function truncate(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + ' ...' : str;
}

/**
 * Get the first character of the string
 * @param str {string} - The input string
 * @returns {string} - Returns the string
 */
export function getFirstCharacter(str: string) {
  return str.charAt(0);
}

/**
 * This function will make the string capitalized
 * @param str {string} - The input string
 * @returns {string} - Returns the string
 */
export function capitalized(str: string) {
  return capitalize(str);
}
