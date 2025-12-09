import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const UniversalModal = ({
  show,
  onHide,
  headerSize = 'lead',
  headerWeight = '700',
  headerBgColor = 'primary',
  headerColor = 'white',
  headerText,
  bodyClass,
  closeButton,
  body = () => { },
  leftBtnVariant = 'link',
  leftBtnClass = 'text-decoration-none text-dark-300',
  leftBtnText = 'Close',
  leftBtnOnClick = onHide,
  rightBtnVariant = 'link',
  rightBtnClass = 'text-decoration-none text-info',
  rightBtnText = 'Save',
  rightButtonDisabled = false,
  rightBtnOnClick,
  footerClass,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header
      className={`${headerSize} text-${headerColor} fw-${headerWeight} bg-${headerBgColor} ${closeButton ? 'justify-content-between' : ''} rounded-top-15`}
    >
      {headerText}
      {closeButton && (
        <FontAwesomeIcon role="button" icon={faTimes} onClick={onHide} />
      )}
    </Modal.Header>
    <Modal.Body
      className={`${bodyClass}`}
    >
      {body}
    </Modal.Body>
    <Modal.Footer className={`justify-content-between border-grey-300 p-0 ${footerClass}`}>
      <Button
        variant={leftBtnVariant}
        className={leftBtnClass}
        onClick={leftBtnOnClick}
      >
        {leftBtnText}
      </Button>
      <Button
        variant={rightBtnVariant}
        className={rightBtnClass}
        onClick={rightBtnOnClick}
        disabled={rightButtonDisabled}
      >
        {rightBtnText}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default UniversalModal;
