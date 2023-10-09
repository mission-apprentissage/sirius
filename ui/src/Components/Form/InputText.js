import React from "react";
import {
  Input,
  InputGroup,
  FormControl,
  FormErrorMessage,
  InputRightElement,
} from "@chakra-ui/react";

const InputText = ({
  id,
  name,
  type = "text",
  placeholder,
  formik = null,
  noErrorMessage = false,
  rightElement,
  rightElementProps,
  ...props
}) => {
  return (
    <FormControl
      isInvalid={
        (!!formik?.errors[name] || props.error) && (formik?.touched[name] || props.touched)
      }
    >
      <InputGroup w="100%">
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={formik?.handleChange}
          value={formik?.values[name]}
          size="lg"
          color="brand.black.500"
          _placeholder={{ color: "brand.black.500" }}
          borderColor="brand.blue.400"
          {...props}
        />
        {rightElement && (
          <InputRightElement {...rightElementProps}>{rightElement}</InputRightElement>
        )}
      </InputGroup>
      {!noErrorMessage && (
        <FormErrorMessage>{formik?.errors[name] || props.error}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default InputText;
