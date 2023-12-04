import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const InputConfigure = ({
  id,
  name,
  type = "text",
  placeholder,
  rightElement,
  rightElementProps,
  onChange,
  value,
  subType = null,
  ...props
}) => {
  return (
    <InputGroup w="100%">
      {(type === "text" || type === "date" || type === "email") && (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          color="brand.black.500"
          _placeholder={{ color: "brand.black.500" }}
          borderColor="brand.blue.400"
          {...props}
        />
      )}
      {type === "number" && (
        <NumberInput
          id={id}
          name={name}
          onChange={onChange}
          value={value}
          step={1}
          min={0}
          max={150}
          {...props}
        >
          {value == "0" && subType === "seats" ? (
            <Input value="Illimité" onChange={() => null} pr="32px" />
          ) : (
            <NumberInputField placeholder={placeholder} _placeholder={props._placeholder} />
          )}
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      )}
      {rightElement && <InputRightElement {...rightElementProps}>{rightElement}</InputRightElement>}
    </InputGroup>
  );
};

export default InputConfigure;
