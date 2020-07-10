import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Bubble, Entry } from "../toolkit";
import { primary } from "../../common/colors";

const UserMessage = styled(Bubble)`
  border: 1px solid ${primary};
  background-color: ${primary};
  border-radius: 10px;
  color: #fff;
`;

const Response = ({ children }) => {
  return (
    <Entry direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
      <UserMessage>{children}</UserMessage>
    </Entry>
  );
};
Response.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Response;
