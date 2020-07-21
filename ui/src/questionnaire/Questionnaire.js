import React from "react";
import queryString from "query-string";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { primary } from "../common/utils/colors";
import { useGet } from "../common/hooks/useGet";
import Chat from "./Chat";
import questionsErreur from "./questionnaires/erreur";
import questionsFinAnnee from "./questionnaires/finAnnee";
import Loading from "../common/Loading";
import Layout from "./Layout";
import { Box } from "../common/Flexbox";
import background from "./icons/background.svg";
import { _put } from "../utils/httpClient";

const Pitch = styled("div")`
  position: absolute;
  width: 400px;
  left: 0;
  z-index: -1000;
  top: 56rem;

  font-weight: 900;
  font-size: 48rem;
  line-height: 39rem;
  text-align: center;
  color: ${primary};
`;

const Background = styled("img").attrs(() => ({ src: background, alt: "background" }))`
  position: absolute;
  width: 400px;
  right: 0;
  z-index: -1000;
  bottom: 0;
`;

export default () => {
  let location = useLocation();
  let { token } = queryString.parse(location.search);
  let [result, loading, error] = useGet(`/api/questionnaires/${token}`);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  let questions = error ? questionsErreur(error) : questionsFinAnnee(result.meta.apprenti);
  return (
    <Layout>
      <Box justify={"center"} height={"100%"}>
        <Chat
          questions={questions}
          onReponse={async (reponse) => {
            await _put(`/api/questionnaires/${token}/reponse`, reponse);
          }}
          onEnd={async () => {
            await _put(`/api/questionnaires/${token}/close`);
          }}
        />
        <Background className={"hide-sm"} />
      </Box>
    </Layout>
  );
};
