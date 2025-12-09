import { Form } from 'react-bootstrap';
import { $form } from '@src/signals';

const CheckBoxInput = ({
  name,
  signal = $form,
  label,
  className,
  ...rest
}) => (
  <Form.Group>
    <Form.Check
      type="checkbox"
      label={label}
      name={name}
      className={`${className} small custom-checkbox`}
      checked={signal.value?.[name] ?? false}
      onChange={() => signal.update({ [name]: !signal.value?.[name] })}
      {...rest}
    />
  </Form.Group>
);

export default CheckBoxInput;
