export const containsNumber = (value, fieldName) => {
  const isValid = /\d/.test(value);
  if (!isValid) throw new Error(`${fieldName} must contain a number`);
};

export const containsLetter = (value, fieldName) => {
  const isValid = /[a-zA-Z]/.test(value);
  if (!isValid) throw new Error(`${fieldName} must contain a letter`);
};

export const validateEmail = (email) => {
  const isValid = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  if (!isValid) throw new Error('Must be a valid email address');
};

export const validateLength = (value, fieldName, min, max) => {
  if (!value) throw new Error(`${fieldName} cannot be empty`);
  const string = String(value).trim();
  if (string.length < min) {
    throw new Error(`${fieldName} must have at least ${min} characters`);
  }
  if (string.length > max) {
    throw new Error(`${fieldName} cannot have more than ${max} characters`);
  }
};

export const validateAmount = (value, fieldName, min = 0, max = Infinity) => {
  const num = Number(value.replace(',', ''));
  if (Number.isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  if (num < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  if (num > max) {
    throw new Error(`${fieldName} must be less than or equal to ${max}`);
  }
};

export const validateEmailIsNotIncluded = (email, password, fieldName) => {
  if (!password) throw new Error(`${fieldName} cannot be empty`);
  const emailString = email.split('@')[0].toLowerCase();
  const passwordString = password.toLowerCase();
  if (passwordString.includes(emailString)) {
    throw new Error(`${fieldName} cannot contain your email address`);
  }
};

export const validateMatchingFields = (value, repeatValue, message = 'Passwords must match') => {
  if (value !== repeatValue) throw new Error(message);
};
