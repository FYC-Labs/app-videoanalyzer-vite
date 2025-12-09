import { Row, Col } from 'react-bootstrap';

const RowsAndColumns = () => (
  <Row className="text-center mt-48" id="row-col">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Rows & Columns</h2>
      <Row>
        <Col className="bg-info border border-2">1 of 3</Col>
        <Col xs={6} className="bg-info border border-2">2 of 3 (wider)</Col>
        <Col className="bg-info border border-2">3 of 3</Col>
      </Row>
      <Row>
        <Col className="bg-info border border-2">1 of 3</Col>
        <Col xs={5} className="bg-info border border-2">2 of 3 (wider)</Col>
        <Col className="bg-info border border-2">3 of 3</Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs lg="2" className="bg-info border border-2">
          1 of 3
        </Col>
        <Col md="auto" className="bg-info border border-2">Variable width content</Col>
        <Col xs lg="2" className="bg-info border border-2">
          3 of 3
        </Col>
      </Row>
      <Row>
        <Col className="bg-info border border-2">1 of 3</Col>
        <Col md="auto" className="bg-info border border-2">Variable width content</Col>
        <Col xs lg="2" className="bg-info border border-2">
          3 of 3
        </Col>
      </Row>
      <Row>
        <Col md={4} className="bg-info border border-2">md=4</Col>
        <Col md={{ span: 4, offset: 4 }} className="bg-info border border-2">{'md={{ span: 4, offset: 4 }}'}</Col>
      </Row>
      <Row>
        <Col md={{ span: 3, offset: 3 }} className="bg-info border border-2">{'md={{ span: 3, offset: 3 }}'}</Col>
        <Col md={{ span: 3, offset: 3 }} className="bg-info border border-2">{'md={{ span: 3, offset: 3 }}'}</Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="bg-info border border-2">{'md={{ span: 6, offset: 3 }}'}</Col>
      </Row>
    </Col>
  </Row>
);

export default RowsAndColumns;
