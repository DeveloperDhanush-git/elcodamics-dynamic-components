// src/App.js
import React from 'react';
import ProgressCard from './Common/DynamicComponent/ProgressCard/ProgressCard';
import { Container, Row, Col } from 'react-bootstrap';

const App = () => {
  const data1 = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    values: [65, 59, 80, 81, 56],
  };

  const data2 = {
    labels: ['June', 'July', 'August', 'September', 'October'],
    values: [45, 49, 60, 71, 66],
  };

  return (
    <Container>
      <Row>
        <Col>
          <ProgressCard title="Sales Data 1" data={data1} />
        </Col>
        <Col>
          <ProgressCard title="Sales Data 2" data={data2} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
