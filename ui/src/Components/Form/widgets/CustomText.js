import { FormControl, FormLabel, Input, Box } from "@chakra-ui/react";

const CustomText = (props) => {
  return (
    <Box mx="5">
      <FormControl variant="floating" id={props.id}>
        <Input
          onChange={(e) => props.onChange(e.target.value)}
          placeholder=" "
          borderColor="purple.400"
          focusBorderColor="purple.400"
          value={props.value}
        />
        <FormLabel>{props.label}</FormLabel>
      </FormControl>
    </Box>
  );
};

export default CustomText;
