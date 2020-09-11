import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { usePut } from "../common/hooks/httpHooks";
import Chat from "./chat/Chat";
import questionsErreur from "./questionnaires/erreur";
import questionsFinAnnee from "./questionnaires/finAnnee";
import Loading from "../common/Loading";
import Layout from "../common/Layout";
import { Box } from "../common/Flexbox";
import background from "../common/icons/background.svg";
import { _put } from "../utils/httpClient";

const Background = styled("img").attrs(() => ({ src: background, alt: "background" }))`
  position: absolute;
  width: 400px;
  right: 0;
  z-index: -1000;
  bottom: 0;
`;

export default () => {
  let { token } = useParams();
  let [questionnaireContext, loading, error] = usePut(`/api/questionnaires/${token}/markAsClicked`);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  let questions = error ? questionsErreur(error) : questionsFinAnnee(questionnaireContext);
  return (
    <Layout>
      <Box justify={"center"} height={"100%"}>
        <Chat
          questions={questions}
          onReponse={(reponse) => {
            return _put(`/api/questionnaires/${token}/addReponse`, reponse);
          }}
          onEnd={() => _put(`/api/questionnaires/${token}/close`)}
        />
        <Background className={"hide-sm"} />
      </Box>
    </Layout>
  );
};
