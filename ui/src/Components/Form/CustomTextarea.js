import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

const CustomTextarea = (props) => {
  return (
    <FormControl id={props.id}>
      <FormLabel as="legend" fontSize="lg" fontWeight="semibold">
        {props.label}
      </FormLabel>
      <Textarea
        onChange={(e) => props.onChange(e.target.value)}
        placeholder=" "
        borderColor="purple.400"
        focusBorderColor="purple.400"
        mt="10px"
      />
    </FormControl>
  );
};

export default CustomTextarea;
