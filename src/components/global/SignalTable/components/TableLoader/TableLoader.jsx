import React from 'react';
import { Placeholder } from 'react-bootstrap';
import './tableLoader.css';

const TableLoader = ({ length = 16 }) => {
  const height = '40px';
  const rows = Array.from({ length });

  return (
    <>
      {rows.map((_, index) => (
        <Placeholder key={index} as="div" animation="wave">
          <Placeholder xs={12} className={`skeleton-row${length > 1 ? ' mb-8' : ''}`} style={{ height }} />
        </Placeholder>
      ))}
    </>
  );
};

export default TableLoader;
