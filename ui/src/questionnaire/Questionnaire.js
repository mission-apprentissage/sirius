import React from "react";
import queryString from "query-string";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { primary } from "../common/utils/colors";
import { useGet } from "../common/hooks/useGet";
import Questions from "./Questions";
import questionsErreur from "./questions/erreur";
import questionsFinAnnee from "./questions/finAnnee";
import Loading from "../common/Loading";
import Layout from "./Layout";
import { Box } from "../common/Flexbox";
import background from "./icons/background.svg";

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
  let [apprenti, loading, error] = useGet(`/api/questionnaires/${token}`);

  let onChange = (data) => {
    console.log(data);
  };
  return (
    <Layout>
      <Box justify={"center"} height={"100%"}>
        {loading ? (
          <Loading />
        ) : (
          <Questions questions={error ? questionsErreur() : questionsFinAnnee(apprenti)} onChange={onChange} />
        )}
        <Background className={"hide-sm"} />
      </Box>
    </Layout>
  );
};
