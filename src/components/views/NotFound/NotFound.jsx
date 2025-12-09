import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container fluid className="d-flex align-items-center justify-content-center vh-100 text-center">
      <Row>
        <Col>
          <h1>Oops something went wrong!</h1>
          <h3>Page not found</h3>
          <Link to="/" className="fs-5">Go back to Home</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
