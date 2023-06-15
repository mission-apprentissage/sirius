import {
  Box,
  Stack,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import shareTemoignage from "../../assets/images/share_temoignage.svg";
import Footer from "../Footer";

const Hero = ({ setStartedAnswering, isMobile, startDate, endDate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isCampagneActive = new Date(startDate) > new Date() || new Date(endDate) < new Date();

  return (
    <>
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
                  Aide ces jeunes à préciser leurs choix d’orientation en répondant à leurs
                  questions sur ta formation en apprentissage
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
                onClick={onOpen}
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
                onClick={onOpen}
                display={isMobile ? "inherit" : "none"}
              >
                Je partage mon témoignage
              </Button>
            </Stack>
          </Box>
        </Box>
        <Footer />
      </Stack>
      <Modal isOpen={isCampagneActive} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">La campagne n'est pas ouverte</ModalHeader>
          <ModalBody textAlign="center" pb="5">
            La campagne est ouverte du {new Date(startDate).toLocaleDateString()} au{" "}
            {new Date(endDate).toLocaleDateString()}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color="purple.500">Mention d’information – Champs libres - Sirius</Text>
          </ModalHeader>
          <ModalBody>
            <Stack>
              <Text>
                Attention à vos{" "}
                <Text as="span" fontWeight="semibold" color="purple.500">
                  données
                </Text>
                , elles sont{" "}
                <Text as="span" fontWeight="semibold" color="purple.500">
                  importantes
                </Text>{" "}
                pour nous !
              </Text>
              <Text>
                C’est pour cela que nous invitons à nous communiquer les{" "}
                <Text as="span" fontWeight="semibold" color="purple.500">
                  seules informations et données strictement nécessaires.
                </Text>
              </Text>
              <Text>
                Notamment, ne communiquez pas vos opinions{" "}
                <Text as="span" fontWeight="semibold" color="purple.500">
                  philosophiques, syndicales, politiques ou sur votre vie sexuelle.{" "}
                </Text>
              </Text>
              <Text fontWeight="semibold" color="purple.500">
                Ces données sont trop personnelles !
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              size="lg"
              variant="solid"
              colorScheme="purple"
              rightIcon={<ArrowForwardIcon />}
              onClick={() => setStartedAnswering(true)}
            >
              C'est parti !
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Hero;
