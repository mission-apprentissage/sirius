import {
  Box,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import parse from "html-react-parser";

import DidYouKnow from "../DidYouKnow";

const CustomUpDown = (props) => {
  return (
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box mx="2">
        <FormControl variant="floating" id={props.id}>
          <NumberInput
            min={props.uiSchema.minimum}
            max={props.uiSchema.maximum}
            step={props.uiSchema.multipleOf}
            onChange={(value) => props.onChange(value)}
            placeholder=" "
            borderColor="brand.blue.700"
            focusBorderColor="brand.blue.700"
            value={props.value}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormLabel>{parse(props.label)}</FormLabel>
        </FormControl>
      </Box>
    </>
  );
};

export default CustomUpDown;
