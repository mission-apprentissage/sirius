import React from "react";
import { Grid, Row, Col, Box } from "./common/FlexboxGrid";

function App() {
  return (
    <div className="App">
      <Grid>
        <Row around={true}>
          <Col>Sirius</Col>
          <Col>
            <Box between={true}>
              <div>titi</div>
              <div>tata</div>
            </Box>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

export default App;
