/**
 * Checks if any field in the form is empty.
 * @param {Array} formFields The form fields to be checked.
 * @returns {boolean} Returns `true` if any field is empty, otherwise `false`.
 */
const isFieldsEmpty = (formFields) => {
  return formFields.some((field) => field?.trim() === '');
};

const UserValidator = {
  isFieldsEmpty,
};

export default UserValidator;
