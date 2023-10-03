import React from "react";
import { Input, InputGroup, FormControl, FormErrorMessage } from "@chakra-ui/react";

const InputText = ({ id, name, type = "text", placeholder, formik }) => {
  return (
    <FormControl isInvalid={!!formik.errors[name] && formik.touched[name]}>
      <InputGroup>
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={formik.handleChange}
          value={formik.values[name]}
          size="lg"
          color="brand.black.500"
          _placeholder={{ color: "brand.black.500" }}
          borderColor="brand.blue.400"
        />
      </InputGroup>
      <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
    </FormControl>
  );
};

export default InputText;
