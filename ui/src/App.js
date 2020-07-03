import React from "react";
import { Grid, Box, Item } from "./common/FlexboxGrid";
import Questionnaire from "./Questionnaire";

function App() {
  return (
    <div className="App">
      <Grid>
        <Box>
          <Item>
            <Questionnaire />
          </Item>
        </Box>
      </Grid>
    </div>
  );
}

export default App;
