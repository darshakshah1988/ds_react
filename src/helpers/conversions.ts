// Function to convert string into integer
export function convertInt(property: string) {
  // If there is a value in the string.
  if (property) {
    return parseInt(property);
  } else {
    return '';
  }
}

// Function to convert string into float
export function convertFloat(property: string) {
  // If there is a value in the string.
  if (property) {
    return parseFloat(property);
  } else {
    return '';
  }
}
