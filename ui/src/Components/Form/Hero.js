import { Box, Stack, Image, Text, Button } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import shareTemoignage from "../../assets/images/share_temoignage.svg";

const Hero = ({ setStartedAnswering, isMobile }) => {
  return (
    <Stack direction="column" w="100%" m="auto">
      <Box w="80%" mx="auto" my="5">
        <Stack direction={isMobile ? "column" : "row"}>
          <Box w={isMobile ? "100%" : "50%"}>
            <Image src={shareTemoignage} alt="" objectFit="contain" w="80%" m="auto" />
            <Text
              color="purple.900"
              fontSize="xs"
              textAlign="center"
              mt="2"
              display={isMobile ? "none" : "inherit"}
            >
              Chloé (3e) - Nazir (3e prépa-métier) - Alba (3e SEGPA)
            </Text>
          </Box>
          <Box w={isMobile ? "100%" : "50%"}>
            <Box display="flex" flexDirection={isMobile ? "column-reverse" : "column"}>
              <Text
                fontSize="2xl"
                color="purple.900"
                fontWeight="semibold"
                textAlign={isMobile ? "center" : "inherit"}
              >
                Aide ces jeunes à préciser leurs choix d’orientation en répondant à leurs questions
                sur ta formation en apprentissage
              </Text>
              <Text
                fontSize="lg"
                color="purple.900"
                mt="5"
                mb={isMobile ? "5" : "0"}
                textAlign={isMobile ? "center" : "inherit"}
              >
                Répondre à ce questionnaire te prendra entre 5 et 10 minutes et ton anonymat sera
                respecté.
              </Text>
            </Box>
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
      <Box bgColor="white" w="100%" pt="10px">
        <Box w={isMobile ? "90%" : "50%"} mx="auto" my="35">
          <Text fontWeight="bold" color="purple.900" fontSize="xl" textAlign="center">
            Flemme de répondre ?
          </Text>
          <Text color="purple.900" fontSize="xl" textAlign="center">
            3 raisons pour te convaincre
          </Text>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing="8"
            my="5"
            alignItems={isMobile ? "center" : "inherit"}
            display="flex"
          >
            <Box
              bgColor="purple.200"
              shadow="md"
              width={isMobile ? "90%" : "250px"}
              borderRadius="12"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Text fontSize="5xl" my="20px">
                💬
              </Text>
              <Text
                fontSize="md"
                lineHeight="6"
                color="purple.900"
                textAlign="center"
                mb="20px"
                mx="15px"
              >
                Personne n’est plus qualifié que toi pour
                <b> renseigner les collégien·nes sur l’apprentissage</b>
              </Text>
            </Box>
            <Box
              bgColor="purple.200"
              shadow="md"
              width={isMobile ? "90%" : "250px"}
              borderRadius="12"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Text fontSize="5xl" my="20px">
                👷🏻‍♀️️
              </Text>
              <Text
                fontSize="md"
                lineHeight="6"
                color="purple.900"
                textAlign="center"
                mb="20px"
                mx="15px"
              >
                <b>On te propose un espace pour t’exprimer</b>, faire le bilan de ton expérience
                d’apprenti·e
              </Text>
            </Box>
            <Box
              bgColor="purple.200"
              shadow="md"
              width={isMobile ? "90%" : "250px"}
              borderRadius="12"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Text fontSize="5xl" my="20px">
                👨🏽‍🎓
              </Text>
              <Text
                fontSize="md"
                lineHeight="6"
                color="purple.900"
                textAlign="center"
                mb="20px"
                mx="15px"
              >
                Avec ton témoignage, tu participes à <b>l’amélioration de ta formation en CFA</b>
              </Text>
            </Box>
            <Button
              size="lg"
              variant="solid"
              colorScheme="purple"
              rightIcon={<ArrowForwardIcon />}
              mt="10"
              onClick={() => setStartedAnswering(true)}
              display={isMobile ? "inherit" : "none"}
            >
              Go
            </Button>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default Hero;
