import { Row, Col, Spinner, Button } from 'react-bootstrap';

const Loaders = () => (
  <Row className="text-center mt-48" id="loader">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Loaders</h2>
      <Row>
        <Col>
          <Spinner animation="border" />
          <Spinner animation="grow" />
        </Col>
      </Row>
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span className="visually-hidden">Loading...</span>
      </Button>{' '}
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </Button>
    </Col>
  </Row>
);

export default Loaders;
