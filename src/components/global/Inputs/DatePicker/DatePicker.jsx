import { Form } from 'react-bootstrap';
import { $form } from '@src/signals';

const DatePicker = ({
  name,
  signal = $form,
  value,
  variant = 'form-control', // || form-control-border
  className,
}) => {
  if (!signal || !name) {
    return new Error(`ZipInput has no signal or name (Name: ${name})`);
  }

  const val = value || signal.value?.[name];

  return (
    <Form.Control
      className={`${variant} ${className} ${val ? '' : 'text-dark-300'} shadow-none py-8 ps-16`}
      type="date"
      value={val ?? ''}
      onChange={(e) => signal.update({ [name]: e.target.value })}
    />
  );
};

export default DatePicker;
