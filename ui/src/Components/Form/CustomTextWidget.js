import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const CustomCheckboxes = (props) => {
  return (
    <FormControl variant="floating" id={props.id}>
      <Input placeholder=" " borderColor="purple.400" focusBorderColor="purple.400" />
      <FormLabel>{props.label}</FormLabel>
    </FormControl>
  );
};

export default CustomCheckboxes;
