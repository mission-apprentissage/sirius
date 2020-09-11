import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import InputContext from "./QuestionContext";
import { Option } from "../../toolkit";
import { pick } from "lodash-es";

const SingleChoice = ({ options }) => {
  let { question, onReponse } = useContext(InputContext);
  return (
    <Box className={"options"} justify={"center"} direction={"column"} wrap={"wrap"}>
      {options.map((option, index) => {
        return (
          <Option
            key={index}
            onClick={() => {
              return onReponse(
                {
                  id: question.id,
                  results: [pick(option, ["id", "label", "satisfaction"])],
                },
                { next: option.next }
              );
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
