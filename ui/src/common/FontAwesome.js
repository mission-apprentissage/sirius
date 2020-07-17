import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneAlt } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { fade } from "./utils/animations";
import { primary, secondary } from "./utils/colors";

const wrapSVG = (icon) => {
  return ({ left, right, ...rest }) => (
    <span style={{ paddingLeft: left ? "5rem" : 0, paddingRight: right ? "5rem" : 0 }} {...rest}>
      <FontAwesomeIcon icon={icon} />
    </span>
  );
};

export const MicroIcon = styled(wrapSVG(faMicrophoneAlt))`
  color: ${primary};
  font-size: 25rem;
  &.fading {
    color: ${secondary};
    animation: ${fade} 1s infinite alternate;
  }
`;

export const ChevronIcon = wrapSVG(faChevronRight);
