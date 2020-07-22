import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import { ChevronIcon } from "../../../common/FontAwesome";
import InputContext from "./QuestionContext";
import { ButtonOption } from "../../toolkit";

const Skip = () => {
  let { onData } = useContext(InputContext);

  return (
    <Box justify={"end"}>
      <ButtonOption
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
      </ButtonOption>
    </Box>
  );
};
Skip.propTypes = {
  onData: PropTypes.func,
};

export default Skip;
