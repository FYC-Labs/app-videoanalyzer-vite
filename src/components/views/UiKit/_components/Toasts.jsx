import { Row, Col, Toast, Button } from 'react-bootstrap';
import { $viewUiKit } from '../_helpers/uikit.consts';

const Toasts = () => (
  <Row className="text-center mt-48" id="toasts">
    <h2 className="text-decoration-underline">Toasts</h2>
    <Col md={6} className="mb-2">
      <Button
        onClick={() => $viewUiKit.update({
          activeModal: 'showA',
        })}
        className="mb-2"
      >
        Toggle Toast <strong>with</strong> Animation
      </Button>
      <Toast show={$viewUiKit.value.activeModal === 'showA'} onClose={() => $viewUiKit.reset()}>
        <Toast.Header>
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Woohoo, you&apos;re reading this text in a Toast!</Toast.Body>
      </Toast>
    </Col>
    <Col md={6} className="mb-2">
      <Button
        onClick={() => $viewUiKit.update({
          activeModal: 'showB',
        })}
        className="mb-2"
      >
        Toggle Toast <strong>without</strong> Animation
      </Button>
      <Toast onClose={() => $viewUiKit.reset()} show={$viewUiKit.value.activeModal === 'showB'} animation={false}>
        <Toast.Header>
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Woohoo, you&apos;re reading this text in a Toast!</Toast.Body>
      </Toast>
    </Col>
  </Row>
);

export default Toasts;
