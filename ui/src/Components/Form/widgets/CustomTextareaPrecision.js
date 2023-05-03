import { FormControl, Textarea } from "@chakra-ui/react";

const CustomTextareaPrecision = (props) => {
  return (
    <FormControl id={props.id}>
      <Textarea
        onChange={(e) => props.onChange(e.target.value)}
        placeholder="Tu peux préciser si tu le souhaites !"
        borderColor="purple.50"
        bgColor="gray.200"
        focusBorderColor="purple.50"
        mt="10px"
        value={props.value}
      />
    </FormControl>
  );
};

export default CustomTextareaPrecision;
