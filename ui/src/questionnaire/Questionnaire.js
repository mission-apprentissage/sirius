import React from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { pickBy } from "lodash-es";
import { ThemeProvider } from "styled-components";
import ChatBot from "react-simple-chatbot";
import { Grid, Box, Item } from "../common/FlexboxGrid";
import { useGet } from "../common/hooks/useGet";
import Loading from "../common/Loading";
import questionsFinAnnee from "./questionsFinAnnee";
import questionsErreur from "./questionsErreur";

const theme = {
  background: "#f5f8fb",
  fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  headerBgColor: "#6e48aa",
  headerFontColor: "#fff",
  headerFontSize: "16px",
  botBubbleColor: "#ac8fda",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

export default () => {
  const submit = ({ steps }) => {
    let stepsWithValues = pickBy(steps, (v) => v.value !== undefined);
    let values = Object.keys(stepsWithValues).reduce((acc, key) => {
      acc[key] = stepsWithValues[key].value;
      return acc;
    }, {});
    console.log(values);
  };

  let location = useLocation();
  let { token } = queryString.parse(location.search);
  let [apprenti, loading, error] = useGet(`/api/questionnaire?token=${token}`);

  if (loading) {
    return <Loading />;
  }

  let questions = error ? questionsErreur() : questionsFinAnnee(apprenti);

  return (
    <Grid>
      <Box>
        <Item>
          <ThemeProvider theme={theme}>
            <ChatBot
              headerTitle={"Sirius"}
              width={"100%"}
              botDelay={1500}
              userDelay={500}
              placeholder={"Tapez votre message ici"}
              recognitionEnable={true}
              recognitionLang={"fr"}
              bubbleOptionStyle={{
                background: "#6E48AA",
                borderRadius: 0,
              }}
              handleEnd={submit}
              steps={questions}
            />
          </ThemeProvider>
        </Item>
      </Box>
    </Grid>
  );
};
