import { Row, Col, Button, Badge, Stack } from 'react-bootstrap';

const Badges = () => (
  <Row className="text-center mt-48" id="badges">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Badges</h2>
      <Button variant="primary">
        Profile <Badge bg="danger">9</Badge>
        <span className="visually-hidden">unread messages</span>
      </Button>
      <Stack direction="horizontal" className="mt-8" gap={2}>
        <Badge bg="primary">Primary</Badge>
        <Badge bg="secondary">Secondary</Badge>
        <Badge bg="success">Success</Badge>
        <Badge bg="danger">Danger</Badge>
        <Badge bg="warning">
          Warning
        </Badge>
        <Badge bg="info">Info</Badge>
        <Badge bg="light" text="dark">
          Light
        </Badge>
        <Badge bg="dark">Dark</Badge>
      </Stack>
      <Stack direction="horizontal" className="mt-8" gap={2}>
        <Badge pill bg="primary">
          Primary
        </Badge>
        <Badge pill bg="secondary">
          Secondary
        </Badge>
        <Badge pill bg="success">
          Success
        </Badge>
        <Badge pill bg="danger">
          Danger
        </Badge>
        <Badge pill bg="warning">
          Warning
        </Badge>
        <Badge pill bg="info">
          Info
        </Badge>
        <Badge pill bg="light" text="dark">
          Light
        </Badge>
        <Badge pill bg="dark">
          Dark
        </Badge>
      </Stack>
    </Col>
  </Row>
);

export default Badges;
