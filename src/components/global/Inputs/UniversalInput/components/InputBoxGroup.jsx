import { useRef, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { $form } from '@src/signals';

const InputBoxGroup = ({ name, signal = $form, variant, className, isValid, isInvalid, options = {}, ...props }) => {
  const inputsRef = useRef([]);
  const parentContainerClassName = options?.parentContainerClassName || '';
  const length = options?.length || 4;

  useEffect(() => {
    const prepopulatedValue = signal.value?.[name] || '';
    prepopulatedValue.split('').forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });
  }, [name, signal]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;

    if (value.length > 1) {
      e.target.value = value.charAt(0);
      return;
    }

    const newValue = [...(signal.value?.[name] || '')];
    newValue[index] = value;
    signal.update({ [name]: newValue.join('') });

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const newValue = pasteData.slice(0, length).split('');

    newValue.forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });

    signal.update({ [name]: newValue.join('') });

    if (newValue.length < length) {
      inputsRef.current[newValue.length].focus();
    }
  };

  return (
    <Row className={`${parentContainerClassName} input-box-group-container`}>
      {Array.from({ length }).map((_, index) => (
        <Col key={index} className="d-flex justify-content-center p-0">
          <Form.Control
            type="text"
            maxLength={1}
            className={`custom-box-input ${variant} ${className || ''} shadow-none py-8`}
            ref={el => { inputsRef.current[index] = el; }}
            onChange={e => handleInputChange(e, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            isValid={isValid}
            isInvalid={isInvalid}
            {...props}
          />
        </Col>
      ))}
    </Row>
  );
};

export default InputBoxGroup;
