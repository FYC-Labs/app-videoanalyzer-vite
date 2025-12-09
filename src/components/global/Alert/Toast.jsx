/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'react-bootstrap';

const Toast = ({ notification, onRemoveNotification }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { timeout = 6000, variant, displayMessage, id } = notification;

  const closeWithAnimation = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemoveNotification(id);
    }, 750);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => closeWithAnimation(), timeout);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <Row className={`z-index-9999 mx-auto slide mt-16 d-flex justify-content-center ${isExiting ? 'slide-out' : 'slide-in'}`}>
      <Col sm={10} md={8} lg={6} xl={4} className={`notification notification-${variant} shadow-sm rounded-4 p-16`}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="text-center">
            {(Array.isArray(displayMessage) ? displayMessage : [displayMessage]).map(message => (
              <div key={message}>{message}</div>
            ))}
          </div>
          <div tabIndex={0} role="button" aria-label="close" onClick={() => onRemoveNotification(id)} className="ms-auto pe-16">
            <FontAwesomeIcon
              style={{ height: '15px', width: '15px' }}
              icon={faTimes}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Toast;
