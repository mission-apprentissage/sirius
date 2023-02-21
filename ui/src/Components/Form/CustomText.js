import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const CustomText = (props) => {
  return (
    <FormControl variant="floating" id={props.id}>
      <Input
        onChange={(e) => props.onChange(e.target.value)}
        placeholder=" "
        borderColor="purple.400"
        focusBorderColor="purple.400"
      />
      <FormLabel>{props.label}</FormLabel>
    </FormControl>
  );
};

export default CustomText;
