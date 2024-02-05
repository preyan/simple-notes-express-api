/**
 * Checks if any of the form fields are empty or unavailable (undefined or null).
 * @param {Array} formFields - The form fields to check.
 * @returns {boolean} - True if any form field is empty or unavailable, false otherwise.
 */
const isEmptyOrUnavailable = (formFields) => {
  if (!formFields.length) {
    return true; // Returns true if formFields is an empty array
  }
  return formFields.some(
    (field) => field === undefined || field === null || field?.trim() === ''
  );
};

export const CommonValidator = {
  isEmptyOrUnavailable,
};
