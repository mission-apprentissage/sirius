import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import { ChevronIcon, HandDownIcon } from "../../../common/FontAwesome";
import InputContext from "./QuestionContext";
import { ChoiceButton } from "../../toolkit";

const moveUpToDown = keyframes`
  0% { transform: translateY(10rem); }
  100% { transform: translateY(30rem); }
`;

const AnimatedIcon = styled(HandDownIcon)`
  animation: ${moveUpToDown} 1s infinite alternate;
`;

const Skip = () => {
  let { onData } = useContext(InputContext);

  return (
    <Box justify={"between"} align={"end"}>
      <AnimatedIcon />
      <ChoiceButton
        onClick={() => {
          return onData({
            value: "skip",
            label: "Non merci",
          });
        }}
      >
        <Box justify={"between"} align={"center"}>
          <span>Passer</span>
          <ChevronIcon left />
        </Box>
      </ChoiceButton>
    </Box>
  );
};
Skip.propTypes = {
  onData: PropTypes.func,
};

export default Skip;
