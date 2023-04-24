import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

const CustomUpDown = (props) => {
  return (
    <FormControl variant="floating" id={props.id}>
      <NumberInput
        min={props.uiSchema.minimum}
        max={props.uiSchema.maximum}
        step={props.uiSchema.multipleOf}
        onChange={(value) => props.onChange(value)}
        placeholder=" "
        borderColor="purple.400"
        focusBorderColor="purple.400"
        value={props.value}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormLabel>{props.label}</FormLabel>
    </FormControl>
  );
};

export default CustomUpDown;
