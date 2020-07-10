import styled from "styled-components";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { appear } from "../animations";
import { Box } from "../../common/Flexbox";
import { ArrowRightIcon } from "../../common/Icons";
import { primary } from "../../common/colors";

const Option = styled(({ children, className, selected, ...rest }) => {
  let clazz = `${className} ${selected ? "selected" : ""}`;
  return (
    <button className={clazz} {...rest}>
      {children}
    </button>
  );
})`
  animation: ${appear} 0.5s ease forwards;
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
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
  :disabled {
    border: 1px solid grey;
    color: grey;
  }
  input {
    padding-left: 10rem;
  }
`;

const MultiChoice = ({ options, onResponse = () => ({}) }) => {
  let [choices, setChoices] = useState([]);
  return (
    <div className={"MultiChoise"}>
      <Box justify={"center"} wrap={"wrap"}>
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
      {choices.length > 0 && (
        <Box justify={"start"}>
          <Option
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
            Suivant <ArrowRightIcon />
          </Option>
        </Box>
      )}
    </div>
  );
};
MultiChoice.propTypes = {
  options: PropTypes.array,
  next: PropTypes.string,
  onResponse: PropTypes.func,
};

export default MultiChoice;
