import { Row, Col, Button, Modal } from 'react-bootstrap';
import { $viewUiKit } from '../_helpers/uikit.consts';

const Modals = () => (
  <Row className="text-center mt-48" id="modal">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Modals</h2>
      <>
        <Button variant="info" onClick={() => $viewUiKit.update({ activeModal: 'modal' })}>
          Launch demo modal
        </Button>
        <Modal show={$viewUiKit.value.activeModal === 'modal'} onHide={() => $viewUiKit.reset()}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => $viewUiKit.reset()}>
              Close
            </Button>
            <Button variant="primary" onClick={() => $viewUiKit.reset()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </Col>
  </Row>
);

export default Modals;
