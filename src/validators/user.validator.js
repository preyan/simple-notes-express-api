/**
 * Checks if any of the form fields are empty or unavailable (undefined or null).
 * @param {Array} formFields - The form fields to check.
 * @returns {boolean} - True if any form field is empty or unavailable, false otherwise.
 */
const isEmptyOrUnavailable = (formFields) => {
  return formFields.some(
    (field) => field === undefined || field === null || field?.trim() === ''
  );
};

export const UserValidator = {
  isEmptyOrUnavailable,
};
