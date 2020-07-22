import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import { ChevronIcon } from "../../../common/FontAwesome";
import InputContext from "./QuestionContext";
import { ChoiceButton, Option } from "../../toolkit";

const MultiChoice = ({ options }) => {
  let { onData } = useContext(InputContext);
  let [values, setValues] = useState([]);

  return (
    <div className={"MultiChoise"}>
      <Box justify={"center"} wrap={"wrap"} direction={"column"}>
        {options.map((option) => {
          return (
            <Option
              key={option.value}
              selected={values.includes(option.value)}
              onClick={() => {
                if (option.next) {
                  return onData(option);
                }

                if (values.includes(option.value)) {
                  setValues(values.filter((v) => v !== option.value));
                } else {
                  setValues([...values, option.value]);
                }
              }}
            >
              {option.label}
            </Option>
          );
        })}
      </Box>
      <Box justify={"end"}>
        <ChoiceButton
          disabled={values.length === 0}
          onClick={() => {
            let results = values.map((c) => {
              return options.find((o) => o.value === c);
            });

            if (results.find((r) => r.extra === "text")) {
            }

            return onData({
              value: results.map((o) => o.value),
              label: `${results.map((r) => r.label).join(", ")}`,
            });
          }}
        >
          <Box justify={"between"} align={"center"}>
            <span>Suivant</span>
            <ChevronIcon left />
          </Box>
        </ChoiceButton>
      </Box>
    </div>
  );
};
MultiChoice.propTypes = {
  options: PropTypes.array,
  next: PropTypes.string,
  onData: PropTypes.func,
};

export default MultiChoice;
