import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import QuestionContext from "./QuestionContext";
import { Option } from "../../toolkit";
import { pick } from "lodash-es";

const SingleChoice = ({ options }) => {
  let { next } = useContext(QuestionContext);
  return (
    <Box className={"options"} justify={"center"} direction={"column"} wrap={"wrap"}>
      {options.map((option, index) => {
        return (
          <Option
            key={index}
            onClick={() => {
              let reponse = pick(option, ["id", "label", "satisfaction"]);
              return next(reponse, { next: option.next });
            }}
          >
            {option.label}
          </Option>
        );
      })}
    </Box>
  );
};
SingleChoice.propTypes = {
  options: PropTypes.array,
  onReponse: PropTypes.func,
};

export default SingleChoice;
