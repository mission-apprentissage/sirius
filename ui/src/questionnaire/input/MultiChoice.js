import styled from "styled-components";
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { primary, secondary } from "../../common/utils/colors";
import { appear } from "../../common/utils/animations";
import { Box } from "../../common/Flexbox";
import { ChevronIcon } from "../../common/FontAwesome";
import ResponseContext from "../ResponseContext";

const Option = styled(({ children, className, selected, ...rest }) => {
  let clazz = `${className} ${selected ? "selected" : ""}`;
  return (
    <button className={clazz} {...rest}>
      {children}
    </button>
  );
})`
  animation: ${appear} 0.3s ease forwards;
  padding: 10px;
  margin: 5px;
  border-radius: 35px;
  border: 1px solid ${primary};
  color: ${primary};
  &.selected {
    border: 1px solid ${primary};
    background-color: ${primary};
    color: #fff;
  }
  &:active,
  &:focus {
    border: 1px solid ${primary};
    outline: none;
  }
`;

const Next = styled(Option)`
  background-color: ${secondary};
  border: 1px solid ${secondary};
  color: white;

  &:active,
  &:focus {
    border: 1px solid ${secondary};
  }

  :disabled {
    background-color: #dedede;
    border: 1px solid #dedede;
    color: grey;
  }
`;

const MultiChoice = ({ options }) => {
  let { onResponse } = useContext(ResponseContext);
  let [choices, setChoices] = useState([]);

  return (
    <div className={"MultiChoise"}>
      <Box justify={"center"} wrap={"wrap"} direction={"column"}>
        {options.map((option) => {
          return (
            <Option
              key={option.value}
              selected={choices.includes(option.value)}
              onClick={() => {
                if (option.next) {
                  return onResponse(option);
                }

                if (choices.includes(option.value)) {
                  setChoices(choices.filter((v) => v !== option.value));
                } else {
                  setChoices([...choices, option.value]);
                }
              }}
            >
              {option.label}
            </Option>
          );
        })}
      </Box>
      <Box justify={"end"}>
        <Next
          disabled={choices.length === 0}
          onClick={() => {
            let results = choices.map((c) => {
              return options.find((o) => o.value === c);
            });
            return onResponse({
              value: results.map((o) => o.value),
              label: `${results[0].label} ${results.length > 1 ? "..." : ""}`,
            });
          }}
        >
          <Box justify={"between"} align={"center"}>
            <span>Suivant</span>
            <ChevronIcon right />
          </Box>
        </Next>
      </Box>
    </div>
  );
};
MultiChoice.propTypes = {
  options: PropTypes.array,
  next: PropTypes.string,
  onResponse: PropTypes.func,
};

export default MultiChoice;
