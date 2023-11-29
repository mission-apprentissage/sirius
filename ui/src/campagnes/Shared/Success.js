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
      <Image src={success} alt="" objectFit="contain" maxW="500px" w="80%" m="auto" mb="10" />
      <Text fontSize="3xl" color="brand.blue.700" fontWeight="semibold" textAlign="center">
        Merci beaucoup d’avoir participé ! 😌
      </Text>
      <Text
        fontSize="lg"
        color="brand.black.500"
        w={isMobile ? "100%" : "50%"}
        textAlign="center"
        mt="2"
      >
        Tes réponses seront partagées aux jeunes qui se posent des questions sur leur orientation
        vers l’apprentissage
      </Text>
    </Box>
  );
};
export default Success;
