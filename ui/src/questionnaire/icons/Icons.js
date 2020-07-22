import React from "react";
import styled from "styled-components";
import sendSVG from "./send.svg";

const Icon = styled("img")`
  width: 90%;
  padding-right: ${(props) => (props.left ? "5rem" : 0)};
  padding-left: ${(props) => (props.right ? "5rem" : 0)};
`;

export const SendIcon = (props) => <Icon src={sendSVG} alt={"Envoyer"} {...props} />;
