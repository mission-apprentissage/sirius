import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";
import { appear } from "../../common/animations";
import { Box } from "../../common/Flexbox";
import { primary } from "../../common/colors";

const Option = styled.button`
  animation: ${appear} 0.5s ease forwards;
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  border: 1px solid ${primary};
  color: ${primary};
  &:active,
  &:focus {
    border: 1px solid ${primary};
    outline: none;
  }
  :disabled {
    border: 1px solid grey;
    color: grey;
  }
`;

const Options = ({ options, onResponse = () => ({}) }) => {
  return (
    <Box className={"options"} justify={"center"} wrap={"wrap"}>
      {options.map((option) => {
        return (
          <Option key={option.value} onClick={() => onResponse(option)}>
            {option.label}
          </Option>
        );
      })}
    </Box>
  );
};
Options.propTypes = {
  options: PropTypes.array,
  onResponse: PropTypes.func,
};

export default Options;
