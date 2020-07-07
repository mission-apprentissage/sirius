import styled from "styled-components";
import { Col, Grid, Row } from "../common/FlexboxGrid";
import { ChatBotIcon } from "../common/Icons";
import React from "react";
import PropTypes from "prop-types";

const Header = styled(() => {
  return (
    <Grid fluid={true}>
      <Row>
        <Col xs={12}>
          <ChatBotIcon left />
          Sirius
        </Col>
      </Row>
    </Grid>
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
