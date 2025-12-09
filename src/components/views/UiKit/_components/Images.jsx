import { Row, Col, Image } from 'react-bootstrap';
import fycLogo from '@src/assets/fycLogo.jpeg';

const Images = () => (
  <Row className="text-center mt-48" id="images">
    <Col sm={12}>
      <h2 className="text-decoration-underline">Images</h2>
      <Row>
        <Col xs={6} md={4}>
          <h6>
            rounded
          </h6>
          <Image src={fycLogo} rounded />
        </Col>
        <Col xs={6} md={4}>
          <h6>
            roundedCircle
          </h6>
          <Image src={fycLogo} roundedCircle />
        </Col>
        <Col xs={6} md={4}>
          <h6>
            thumbnail
          </h6>
          <Image src={fycLogo} thumbnail />
        </Col>
      </Row>
      <Row>
        <Col sm={{ span: 4, offset: 4 }}>
          <h6>
            Fluid Image
          </h6>
          <Image src={fycLogo} fluid />
        </Col>
      </Row>
    </Col>
  </Row>
);

export default Images;
