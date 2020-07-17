import styled from "styled-components";
import { Col, Container, Row } from "../common/FlexboxGrid";
import { ChatBotIcon } from "../common/FontAwesome";
import React from "react";
import PropTypes from "prop-types";

const Header = styled(() => {
  return (
    <Container fluid={true}>
      <Row>
        <Col xs={12}>
          <ChatBotIcon left />
          Sirius
        </Col>
      </Row>
    </Container>
  );
})`
  padding: 10px;
  background-color: #0746a6;
  color: #ffffff;
`;

Header.propTypes = {
  left: PropTypes.bool,
  right: PropTypes.bool,
};
