import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import { ChevronIcon, HandDownIcon } from "../../../common/FontAwesome";
import QuestionContext from "./QuestionContext";
import { ChoiceButton } from "../../toolkit";

const moveUpToDown = keyframes`
  0% { transform: translateY(10px); }
  100% { transform: translateY(20px); }
`;

const AnimatedIcon = styled(HandDownIcon)`
  animation: ${moveUpToDown} 1s infinite alternate;
`;

const Skip = () => {
  let { next } = useContext(QuestionContext);

  return (
    <Box justify={"between"} align={"end"}>
      <AnimatedIcon />
      <ChoiceButton onClick={() => next({ id: 1000, label: "Non merci" })}>
        <Box justify={"between"} align={"center"}>
          <span>Passer</span>
          <ChevronIcon left />
        </Box>
      </ChoiceButton>
    </Box>
  );
};
Skip.propTypes = {
  onReponse: PropTypes.func,
};

export default Skip;
