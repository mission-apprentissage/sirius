import { Box, Text, Image, useBreakpoint } from "@chakra-ui/react";
import success from "../../assets/images/success.svg";

const Success = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      w={isMobile ? "80%" : "100%"}
      flexDirection="column"
      m="auto"
      mt={isMobile ? "10" : "0"}
    >
      <Text fontSize="3xl" color="purple.900" fontWeight="semibold" textAlign="center">
        😌 Merci beaucoup d’avoir participé !
      </Text>
      <Text
        fontSize="lg"
        color="purple.900"
        w={isMobile ? "100%" : "50%"}
        textAlign="center"
        mt="2"
      >
        Tes réponses seront partagées aux jeunes qui s’interrogent sur les formations en
        apprentissage
      </Text>
      <Image src={success} alt="" objectFit="contain" maxW="500px" w="80%" m="auto" mt="10" />
    </Box>
  );
};
export default Success;
