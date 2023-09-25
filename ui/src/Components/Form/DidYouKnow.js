import { Box, Text, useBreakpoint } from "@chakra-ui/react";
import parse from "html-react-parser";

const DidYouKnow = (content) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  if (!content) return null;
  return (
    <Box
      bgColor="purple.50"
      width="100%"
      display="flex"
      p="4"
      mb="4"
      alignItems="center"
      justifyContent={isMobile ? "center" : "initial"}
    >
      <Box
        bgColor="purple.500"
        borderRadius="100%"
        width="38px"
        height="38px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        w={isMobile ? "100px" : "40px"}
      >
        <Text fontSize="2xl">💡</Text>
      </Box>
      <Box ml="2">
        <Text color="purple.600" fontWeight="semibold">
          Le savais-tu ?
        </Text>
        <Text color="purple.600">{parse(content)}</Text>
      </Box>
    </Box>
  );
};

export default DidYouKnow;
