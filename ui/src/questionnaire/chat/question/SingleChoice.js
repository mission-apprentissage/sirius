import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import InputContext from "./QuestionContext";
import { Option } from "../../toolkit";

const SingleChoice = ({ options }) => {
  let { onData } = useContext(InputContext);
  return (
    <Box className={"options"} justify={"center"} direction={"column"} wrap={"wrap"}>
      {options.map((option) => {
        return (
          <Option key={option.value} onClick={() => onData(option)}>
            {option.label}
          </Option>
        );
      })}
    </Box>
  );
};
SingleChoice.propTypes = {
  options: PropTypes.array,
  onData: PropTypes.func,
};

export default SingleChoice;
