import { Row, Col, ProgressBar } from 'react-bootstrap';

const ProgressBars = () => (
  <Row className="text-center mt-48" id="progress">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Progress Bars</h2>
      <ProgressBar animated now={45} />
    </Col>
  </Row>
);

export default ProgressBars;
