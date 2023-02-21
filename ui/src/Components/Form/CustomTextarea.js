import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const CustomTextarea = (props) => {
  return (
    <FormControl variant="floating" id={props.id}>
      <Textarea
        onChange={(e) => props.onChange(e.target.value)}
        placeholder=" "
        borderColor="purple.400"
        focusBorderColor="purple.400"
      />
      <FormLabel>{props.label}</FormLabel>
    </FormControl>
  );
};

export default CustomTextarea;
