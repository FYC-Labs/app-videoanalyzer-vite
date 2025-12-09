import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { $form } from '@src/signals';
import {
  $password,
  getBorderColor,
  isPasswordInvalid,
} from '@src/components/global/Inputs/Password/_helpers/password.events';

const Password = ({
  name,
  signal = $form,
  className,
  placeholder,
  value,
  customOnChange,
  inputFormatCallback,
  passwordToMatch,
  ...props
}) => {
  const { [`${name}Password`]: isPasswordVisible = false } = $password.value;
  const { [name]: val } = signal.value;
  const feedback = val && isPasswordInvalid(val, passwordToMatch);

  return (
    <>
      <InputGroup
        className={`
          ${className} ${feedback ? '' : 'mb-16'}
          border border-${getBorderColor(name, val, passwordToMatch)}
        `}
        onMouseEnter={() => $password.update({ [`${name}Hover`]: true })}
        onMouseLeave={() => $password.update({ [`${name}Hover`]: false })}
        style={{ borderRadius: '0.375rem' }}
      >
        <Form.Control
          name={name}
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder={placeholder || 'Password'}
          value={value}
          onChange={customOnChange || ((e) => signal.update({
            [name]: inputFormatCallback ? inputFormatCallback(e.target.value) : e.target.value,
          }))}
          className="form-control border-0 shadow-none py-8 ps-16"
          onFocus={() => $password.update({ [`${name}Focus`]: true })}
          onBlur={() => $password.update({ [`${name}Focus`]: false })}
          isValid={val && !isPasswordInvalid(val, passwordToMatch)}
          isInvalid={val && isPasswordInvalid(val, passwordToMatch)}
          style={{ borderRadius: '0.375rem' }}
          {...props}
        />
        <InputGroup.Text
          className="bg-white border-0 p-0 pe-8"
          onClick={() => $password.update({ [`${name}Password`]: !isPasswordVisible })}
          style={{
            cursor: 'pointer',
            borderTopRightRadius: '0.375rem',
            borderBottomRightRadius: '0.375rem',
          }}
        >
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEye : faEyeSlash}
            className="text-dark-400"
            style={{ height: '14px', width: '18px' }}
          />
        </InputGroup.Text>
      </InputGroup>
      {feedback && <p className="xsmall text-danger ms-8 mb-0">{feedback}</p>}
    </>
  );
};

export default Password;
