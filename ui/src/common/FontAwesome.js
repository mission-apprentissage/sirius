import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneAlt, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-regular-svg-icons";
import styled from "styled-components";
import { fade } from "./utils/animations";
import { primary, secondary } from "./utils/colors";

const wrapSVG = (icon) => {
  return ({ left, right, ...rest }) => (
    <span style={{ paddingLeft: left ? "5px" : 0, paddingRight: right ? "5px" : 0 }} {...rest}>
      <FontAwesomeIcon icon={icon} />
    </span>
  );
};

export const MicroIcon = styled(wrapSVG(faMicrophoneAlt))`
  color: ${primary};
  font-size: 25px;
  &.fading {
    color: ${secondary};
    ${fade};
  }
`;

export const ChevronIcon = wrapSVG(faChevronRight);
export const HandDownIcon = styled(wrapSVG(faHandPointDown))`
  color: ${primary};
  font-size: 25px;
`;
