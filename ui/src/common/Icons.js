import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAstronaut, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const createIcon = (icon) => {
  return styled((props) => (
    <span {...props}>
      <FontAwesomeIcon icon={icon} />
    </span>
  ))`
    padding-right: ${(props) => (props.left ? 0 : "5rem")};
    padding-left: ${(props) => (props.right ? 0 : "5rem")};
  `;
};

export const ChatBotIcon = createIcon(faUserAstronaut);
export const ArrowRightIcon = createIcon(faArrowRight);
