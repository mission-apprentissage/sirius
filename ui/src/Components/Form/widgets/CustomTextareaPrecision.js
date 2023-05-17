import { FormControl, Textarea, Box, useBreakpoint } from "@chakra-ui/react";

const CustomTextareaPrecision = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  return (
    <Box mx={isMobile ? "0" : "5"}>
      <FormControl id={props.id} width="100%">
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Tu peux préciser si tu le souhaites !"
          borderColor="purple.50"
          bgColor="gray.200"
          focusBorderColor="purple.50"
          mt="10px"
          value={props.value}
          size="md"
        />
      </FormControl>
    </Box>
  );
};

export default CustomTextareaPrecision;
