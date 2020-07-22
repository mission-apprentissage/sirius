import styled from "styled-components";
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { primary, secondary } from "../../../common/utils/colors";
import { appear } from "../../../common/utils/animations";
import { Box } from "../../../common/Flexbox";
import { ChevronIcon } from "../../../common/FontAwesome";
import InputContext from "./QuestionContext";

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

const Button = styled(Option)`
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
        <Button
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
        </Button>
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
