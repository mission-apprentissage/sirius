import { Box, Text, useBreakpoint } from "@chakra-ui/react";
import parse from "html-react-parser";

const DidYouKnow = ({ content }) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  if (!content) return null;

  return (
    <Box
      bgColor="brand.blue.100"
      width="calc(100% + 48px)"
      ml="-24px"
      display="flex"
      p="4"
      mb="4"
      alignItems="center"
      justifyContent={isMobile ? "center" : "initial"}
    >
      <Box
        bgColor="brand.blue.700"
        borderRadius="100%"
        width="40px"
        height="40px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="40px"
      >
        <Text fontSize="2xl">💡</Text>
      </Box>
      <Box ml="2" w="calc(100% - 40px)">
        <Text color="brand.blue.700" fontWeight="semibold">
          Le savais-tu ?
        </Text>
        <Text color="brand.blue.700">{parse(content)}</Text>
      </Box>
    </Box>
  );
};

export default DidYouKnow;
