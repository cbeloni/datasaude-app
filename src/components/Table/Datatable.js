import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';


const DataTable = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    console.log('Iniciando')
  }, []);

  return (
    <div>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="info">Info</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
};

export default DataTable;
