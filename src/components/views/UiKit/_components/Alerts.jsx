import { Row, Col, Button } from 'react-bootstrap';
import { dangerAlert, infoAlert, successAlert } from '@src/components/global/Alert/_helpers/alert.events';

const Alerts = () => (
  <Row className="text-center mt-48" id="alerts">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Alerts</h2>
      <Button onClick={() => successAlert('Hello world!')} className="mb-8">Launch Succcess Alert Demo</Button>
      <Button onClick={() => dangerAlert('Hello world!')} className="mb-8">Launch Danger Alert Demo</Button>
      <Button onClick={() => infoAlert('Hello world!')} className="mb-8">Launch Info Alert Demo</Button>
    </Col>
  </Row>
);

export default Alerts;
