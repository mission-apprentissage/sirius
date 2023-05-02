import { Box, Stack, Image, Text, Button } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import shareTemoignage from "../../assets/images/share_temoignage.svg";

const Hero = ({ setStartedAnswering, isMobile, categories }) => {
  return (
    <Stack direction="column" w="100%" m="auto">
      <Box w="80%" mx="auto" my="5">
        <Stack direction={isMobile ? "column" : "row"}>
          <Box w={isMobile ? "100%" : "50%"}>
            <Image src={shareTemoignage} alt="" objectFit="contain" w="80%" m="auto" />
            <Text color="purple.900" fontSize="xs" textAlign="center" mt="2">
              Chloé (3e) - Nazir (3e prépa-métier) - Alba (3e SEGPA)
            </Text>
          </Box>
          <Box w={isMobile ? "100%" : "50%"}>
            <Text fontSize="2xl" color="purple.900" fontWeight="semibold">
              Aide ces jeunes à préciser leurs choix d’orientation en répondant à leurs questions
              sur ta formation en apprentissage
            </Text>
            <Text fontSize="lg" color="purple.900" mt="5">
              Ça ne prendra pas plus de 5 minutes, promis !
            </Text>
            <Button
              size="lg"
              variant="solid"
              colorScheme="purple"
              rightIcon={<ArrowForwardIcon />}
              mt="10"
              onClick={() => setStartedAnswering(true)}
            >
              Je partage mon témoignage
            </Button>
          </Box>
        </Stack>
      </Box>
      <Box bgColor="white" w="100%" pt="35">
        {categories.length && (
          <Box
            display="flex"
            m="auto"
            w={isMobile ? "100%" : "60%"}
            justifyContent="center"
            flexWrap={isMobile ? "wrap" : "nowrap"}
          >
            {categories.map((category, index) => (
              <Box
                key={index}
                justifyContent="flex-start"
                alignItems="center"
                mx="10"
                display="flex"
                flexDirection="column"
                width="88px"
                my={isMobile ? "2" : "0"}
              >
                <Box
                  borderRadius="100%"
                  bgColor="purple.200"
                  w="88px"
                  h="88px"
                  fontSize="5xl"
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                >
                  {category.emoji}
                </Box>
                <Text
                  color="purple.900"
                  fontSize="sm"
                  textAlign="center"
                  wordBreak="break-word"
                  mt="2"
                >
                  {category.title}
                </Text>
              </Box>
            ))}
          </Box>
        )}
        <Box w={isMobile ? "90%" : "60%"} mx="auto" my="35">
          <Text fontWeight="bold" color="purple.900" fontSize="xl" textAlign="center">
            Flemme de répondre ? 3 raisons pour te convaincre
          </Text>
          <Box mt="5">
            <Text display="flex" alignItems="center" justifyContent="center" fontSize="sm" my="2">
              <ArrowForwardIcon mr={isMobile ? "5" : "2"} />
              Un espace pour t’exprimer et faire le bilan sur ton expérience d’apprenti·e
            </Text>
            <Text display="flex" alignItems="center" justifyContent="center" fontSize="sm" my="2">
              <ArrowForwardIcon mr={isMobile ? "5" : "2"} />
              Tu feras remonter de l’info anonymement à ton CFA pour améliorer ta formation
            </Text>
            <Text display="flex" alignItems="center" justifyContent="center" fontSize="sm" my="2">
              <ArrowForwardIcon mr={isMobile ? "5" : "2"} />
              Personne n’est plus qualifié que toi pour aider des jeunes sur leur orientation
            </Text>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default Hero;
