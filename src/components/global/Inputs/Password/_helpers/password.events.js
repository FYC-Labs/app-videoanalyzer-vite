import Signal from '@fyclabs/tools-fyc-react/signals/Signal';

export const $password = Signal({});

export const isPasswordInvalid = (password, passwordToMatch) => {
  if (passwordToMatch) {
    if (password !== passwordToMatch) return 'Passwords must match';
    return false;
  }
  if (!password) return false;
  if (password?.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an upper case letter';
  if (!/[a-z]/.test(password)) return 'Must contain a lower case letter';
  if (!/\d/.test(password)) return 'Must contain a number';
  if (!/[*@!#%&()^~{}]+/.test(password)) return 'Must contain a special character';
  return false;
};

export const getBorderColor = (name, val, passwordToMatch) => {
  const {
    [`${name}Hover`]: isHovered,
    [`${name}Focus`]: isFocused,
  } = $password.value;

  if (val && !isPasswordInvalid(val, passwordToMatch)) return 'success';
  if (val && isPasswordInvalid(val, passwordToMatch)) return 'danger';
  if (isHovered) return 'primary';
  if (isFocused) return 'focus';
  return 'grey';
};
