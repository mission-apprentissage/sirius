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

const Hero = ({ setStartedAnswering, isMobile, startDate, endDate, seats, temoignageCount }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isCampagneActive = new Date(startDate) > new Date() || new Date(endDate) < new Date();
  const hasOpenSeats = !seats || seats > temoignageCount;

  return (
    <>
      <Stack direction="column" w="100%" m="auto">
        <Box w="80%" mx="auto" my="5">
          <Stack
            direction={isMobile ? "column-reverse" : "row"}
            alignItems={isMobile ? "inherit" : "center"}
          >
            <Box w="50%" display={isMobile ? "none" : "inherit"} flexDirection="column">
              <Image src={shareTemoignage} alt="" objectFit="contain" w="80%" m="auto" />
              <Text color="purple.900" fontSize="14px" textAlign="center" mt="4">
                <Text as="span" mr="2">
                  ⏳ 5-10 minutes
                </Text>
                <Text as="span" ml="2">
                  😎 Anonyme
                </Text>
              </Text>
            </Box>
            <Box w={isMobile ? "100%" : "50%"}>
              <Box display="flex" flexDirection="column">
                <Text
                  fontSize="3xl"
                  color="purple.900"
                  fontWeight="600"
                  textAlign={isMobile ? "center" : "inherit"}
                >
                  Tu es apprenti·e ?
                </Text>
                <Text
                  fontSize="lg"
                  color="purple.900"
                  mt="5"
                  mb={isMobile ? "5" : "0"}
                  textAlign={isMobile ? "center" : "inherit"}
                  fontWeight="600"
                >
                  Partage ton expérience aux plus jeunes pour les aider dans leurs choix
                  d’orientation !
                </Text>
              </Box>
              <Box w={isMobile ? "100%" : "50%"} display={isMobile ? "inherit" : "none"}>
                <Image src={shareTemoignage} alt="" objectFit="contain" w="80%" m="auto" />
                <Text color="purple.900" fontSize="14px" textAlign="center" mt="4">
                  <Text as="span" mr="2">
                    ⏳ 5-10 minutes
                  </Text>
                  <Text as="span" ml="2">
                    😎 Anonyme
                  </Text>
                </Text>
              </Box>
              <Box
                display="flex"
                justifyContent={isMobile ? "center" : "inherit"}
                alignItems="center"
                mt="5"
              >
                <Button
                  size="lg"
                  variant="solid"
                  colorScheme="purple"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={onOpen}
                >
                  Répondre
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box bgColor="white" w="100%" pt="10px">
          <Box w={isMobile ? "80%" : "50%"} mx="auto" my="35">
            <Text fontWeight="600" color="purple.900" fontSize="3xl" textAlign="center">
              Flemme de répondre au questionnaire ?
            </Text>
            <Text color="purple.900" fontSize="sm" textAlign="center" mt="5" mb="10">
              3 raisons de le faire :
            </Text>
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems={isMobile ? "center" : "inherit"}
              display="flex"
              spacing="3"
            >
              <Box
                width={isMobile ? "100%" : "250px"}
                display="flex"
                flexDirection={isMobile ? "row" : "column"}
                justifyContent="center"
                alignItems="center"
                ml="5"
              >
                <Text fontSize="48px" my="20px">
                  👷🏻‍♀️️
                </Text>
                <Text
                  fontSize="md"
                  lineHeight="6"
                  color="purple.900"
                  textAlign={isMobile ? "left" : "center"}
                  mx="15px"
                  fontWeight="400"
                >
                  <Text as="span" fontWeight="600">
                    Tu sais mieux que tout le monde
                  </Text>{" "}
                  ce que vit un·e apprenti·e au quotidien
                </Text>
              </Box>
              <Box
                width={isMobile ? "100%" : "250px"}
                display="flex"
                flexDirection={isMobile ? "row" : "column"}
                justifyContent="center"
                alignItems="center"
                ml="5"
              >
                <Text fontSize="48px" my="20px">
                  💬
                </Text>
                <Text
                  fontSize="md"
                  lineHeight="6"
                  color="purple.900"
                  textAlign={isMobile ? "left" : "center"}
                  mx="15px"
                  fontWeight="400"
                >
                  <Text as="span">Tu pourras</Text>
                  <Text as="span" fontWeight="600">
                    {" "}
                    prendre du recul sur ton expérience
                  </Text>{" "}
                  en apprentissage
                </Text>
              </Box>
              <Box
                width={isMobile ? "100%" : "250px"}
                display="flex"
                flexDirection={isMobile ? "row" : "column"}
                justifyContent="center"
                alignItems="center"
                ml="5"
              >
                <Text fontSize="48px" my="20px">
                  🏫
                </Text>
                <Text
                  fontSize="md"
                  lineHeight="6"
                  color="purple.900"
                  textAlign={isMobile ? "left" : "center"}
                  mx="15px"
                  fontWeight="600"
                >
                  Tu participeras à l’amélioration de ton CFA
                </Text>
              </Box>
            </Stack>
            <Box width="100%" textAlign="center" mt="10">
              <Text fontSize="sm">Alors, tu veux bien nous aider ?</Text>
            </Box>
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
      <Modal isOpen={!hasOpenSeats} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">La campagne n'a plus de places disponibles</ModalHeader>
          <ModalBody textAlign="center" pb="5">
            La campagne n'a plus de place disponible. Merci de contacter un administrateur.
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
