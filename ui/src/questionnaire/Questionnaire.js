import React from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { Grid, Row, Col } from "../common/FlexboxGrid";
import { useGet } from "../common/hooks/useGet";
import styled from "styled-components";
import Questions from "./questions/Questions";
import questionsErreur from "./erreur";
import questionsFinAnnee from "./finAnnee";
import { primary } from "../common/colors";
import logo from "../common/logo.svg";

const Header = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${primary};
  color: #ffffff;
  margin-left: -16px;
  margin-right: -16px;
`;

const ChatGrid = styled(Grid).attrs(() => ({ className: "chat-grid" }))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const ChatRow = styled(Row).attrs(() => ({ className: "chat-row" }))`
  flex: 1;
  min-height: 0; /* without min-height/height:0 flex:1 doesn't work */
  flex-direction: column;
`;

const ChatCol = styled(Col).attrs(() => ({ className: "chat-col" }))`
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
`;

const Input = styled.input.attrs(() => ({ type: "text" }))`
  width: 100%;
  padding: 10px 0 10px 10px;
  border-top: 1px solid #ced4da;
  border-bottom: none;
  border-left: none;
  border-right: none;
  background-color: #f1f0f0;
  margin-left: -16px;
  margin-right: -16px;
  &:active,
  &:focus {
    outline: none;
  }
`;

export default () => {
  let location = useLocation();
  let { token } = queryString.parse(location.search);
  let [apprenti, loading, error] = useGet(`/api/questionnaire?token=${token}`);
  let questions = error ? questionsErreur() : questionsFinAnnee(apprenti);

  return (
    <ChatGrid fluid={true}>
      <Row>
        <Col xs={12}>
          <Header>
            <img src={logo} />
          </Header>
        </Col>
      </Row>

      <ChatRow>
        <ChatCol xs={12}>
          <Questions questions={questions} onChange={(data) => console.log(data)} />
        </ChatCol>
      </ChatRow>
    </ChatGrid>
  );
};
