import { Form } from 'react-bootstrap';
import { $form } from '@src/signals';
import InputBoxGroup from '@src/components/global/Inputs/UniversalInput/components/InputBoxGroup';
import CheckBoxInput from '@src/components/global/Inputs/UniversalInput/components/CheckBoxInput';
import { formatDate, formatPhone, formatTime, isEmailValid } from './_helpers/universalinput.events';

const UniversalInput = ({
  type,
  name,
  signal = $form,
  variant = 'form-control', // || form-control-border
  className,
  placeholder,
  inputFormatCallback,
  value,
  customOnChange, // ONLY USE IF NEEDED
  autoComplete,
  isValid,
  isInvalid,
  inputBoxGroupOptions = {},
  disabled,
  ...props
}) => {
  if ((!signal || !name) && !customOnChange) {
    return new Error(`Universal Input has no signal or name (Name: ${name})`);
  }

  if (type === 'inputBoxGroup') {
    return (
      <InputBoxGroup
        name={name}
        signal={signal}
        variant={variant}
        className={className}
        isValid={isValid}
        isInvalid={isInvalid}
        options={inputBoxGroupOptions}
        {...props}
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <CheckBoxInput
        name={name}
        signal={signal}
        className={className}
        {...props}
      />
    );
  }

  const { [name]: val } = signal.value;

  const validation = {
    email: { valid: isEmailValid(val), invalid: !isEmailValid(val) },
    phone: { valid: val?.length === 14, invalid: val?.length < 14 },
  };

  const formatValue = () => {
    if (type === 'phone') {
      return formatPhone(val);
    }
    if (type === 'date') {
      return formatDate(val);
    }
    if (type === 'time') {
      if (val instanceof Date) {
        return formatTime(val);
      }
      return val || value || '';
    }
    return val || value || '';
  };

  return (
    <Form.Control
      type={type || 'text'}
      value={formatValue()}
      placeholder={placeholder}
      className={`w-100 ${variant} ${className || ''} ${disabled ? 'text-dark-300' : ''} shadow-none py-8 ps-16`}
      name={name}
      autoComplete={autoComplete}
      onChange={customOnChange || ((e) => signal.update({
        [name]: inputFormatCallback ? inputFormatCallback(e.target.value) : e.target.value,
      }))}
      isValid={validation[type] ? validation[type].valid : isValid}
      isInvalid={validation[type] ? val && validation[type].invalid : isInvalid}
      disabled={disabled}
      maxLength={type === 'phone' ? 14 : ''}
      {...props}
    />
  );
};

export default UniversalInput;
