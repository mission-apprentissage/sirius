import React from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { Col, Grid, Row } from "../common/FlexboxGrid";
import { useGet } from "../common/hooks/useGet";
import styled from "styled-components";
import Questions from "./Questions";
import questionsErreur from "./questions/erreur";
import questionsFinAnnee from "./questions/finAnnee";
import { primary } from "../common/colors";
import logo from "../common/logo.svg";
import Loading from "../common/Loading";

const Header = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${primary};
  color: ${primary};
  margin-left: -8px;
  margin-right: -8px;
`;

const Title = styled.span`
  padding-left: 20px;
  font-weight: 600;
`;

const ChatGrid = styled(Grid).attrs(() => ({ className: "chat-grid" }))`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  min-width: 320px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;

  @media (min-width: 576px) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 600px;
    max-height: 900px;
  }
`;

const ChatRow = styled(Row).attrs(() => ({ className: "chat-row" }))`
  flex: 1;
  min-height: 0; /* without min-height/height:0 flex:1 doesn't work */
  flex-direction: column;
`;

const ChatCol = styled(Col).attrs(() => ({ className: "chat-col" }))`
  overflow-y: auto;
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
  let [apprenti, loading, error] = useGet(`/api/questionnaires/${token}`);

  return (
    <ChatGrid>
      <Row>
        <Col xs={12}>
          <Header>
            <img src={logo} alt={"logo"} />
            <Title>Aidez les futurs apprentis à choisir leur formation</Title>
          </Header>
        </Col>
      </Row>

      <ChatRow>
        <ChatCol xs={12}>
          {loading ? (
            <Loading />
          ) : (
            <Questions
              questions={error ? questionsErreur() : questionsFinAnnee(apprenti)}
              onChange={(data) => console.log(data)}
            />
          )}
        </ChatCol>
      </ChatRow>
    </ChatGrid>
  );
};
