import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Accordion, Button, Card, Col, Row } from 'react-bootstrap';

const UniversalCard = ({
  headerBgColor = 'primary',
  headerColor = 'dark',
  isHeaderHidden = false,
  headerText = '',
  isCollapsible = true,
  bodyBgColor = 'white',
  bodyContainer = 'container-fluid', // OR 'container'
  Body = () => { },
  footerActions = null,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleAccordion = () => setIsOpen(prevState => !prevState);

  const cardHeader = (
    <Card.Header
      className={`d-flex justify-content-between p-0 ps-16 border-0 rounded-top-15 bg-${headerBgColor} ${isOpen ? '' : 'rounded-15'}`}
    >
      <span className={`fw-700 my-auto py-8 text-${headerColor}`}>{headerText}</span>
      {isCollapsible && (
        <Button onClick={toggleAccordion} variant="transparent" className="rounded-15">
          <FontAwesomeIcon className={`text-${headerColor}`} icon={isOpen ? faChevronUp : faChevronDown} />
        </Button>
      )}
    </Card.Header>
  );

  const cardBody = (
    <Card.Body className={`p-0 bg-${bodyBgColor} ${!footerActions ? 'rounded-bottom-15' : ''} ${isHeaderHidden ? 'rounded-top-15' : ''}`}>
      <div className={`${bodyContainer}`}>{Body}</div>
    </Card.Body>
  );

  const cardFooter = (
    <Card.Footer className="rounded-bottom-15">
      {footerActions?.length === 1 && (
        <Row className="mx-0">
          <Col className="p-0 d-flex justify-content-end ">
            <Button size="sm" onClick={footerActions[0]?.onClick} variant="link" className="w-auto p-0 text-decoration-none text-info fw-500">
              {footerActions[0]?.text}
            </Button>
          </Col>
        </Row>
      )}
      {footerActions?.length === 2 && (
        <Row className="d-flex justify-content-between mx-0">
          <Col className="p-0">
            <Button size="sm" onClick={footerActions[0]?.onClick} variant="link" className="w-auto p-0 text-decoration-none text-info fw-500">
              {footerActions[0]?.text}
            </Button>
          </Col>
          <Col className="p-0 d-flex justify-content-end">
            <Button size="sm" onClick={footerActions[1]?.onClick} variant="link" className="w-auto p-0 text-decoration-none text-info fw-500">
              {footerActions[1]?.text}
            </Button>
          </Col>
        </Row>
      )}
    </Card.Footer>
  );

  return (
    <Card className={`border-0 shadow rounded-bottom-15 ${isHeaderHidden ? 'rounded-top-15' : ''}`}>
      {isHeaderHidden ? (
        <>
          {cardBody}
          {footerActions && footerActions?.length > 0 ? cardFooter : null}
        </>
      ) : (
        <Accordion activeKey={isOpen ? '1' : null}>
          <Card className="border-0 rounded-bottom-15">
            {cardHeader}
            <Accordion.Collapse eventKey="1" className="rounded-bottom-15">
              <>
                {cardBody}
                {footerActions && footerActions?.length > 0 ? cardFooter : null}
              </>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      )}
    </Card>
  );
};

export default UniversalCard;
