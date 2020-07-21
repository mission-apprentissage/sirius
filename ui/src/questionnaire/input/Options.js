import styled from "styled-components";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { appear } from "../../common/utils/animations";
import { Box } from "../../common/Flexbox";
import { primary } from "../../common/utils/colors";
import InputContext from "./InputContext";

const Option = styled.button`
  animation: ${appear} 0.3s ease forwards;
  padding: 10px;
  margin: 5px;
  border-radius: 35px;
  border: 1px solid ${primary};
  color: ${primary};
  &:active,
  &:focus {
    border: 1px solid ${primary};
    outline: none;
    background-color: ${primary};
    color: white;
  }
  :disabled {
    border: 1px solid grey;
    color: grey;
  }
`;

const Options = ({ options }) => {
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
Options.propTypes = {
  options: PropTypes.array,
  onData: PropTypes.func,
};

export default Options;
