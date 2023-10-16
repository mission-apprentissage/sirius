import React, { useContext } from "react";
import {
  Box,
  Spinner,
  Text,
  Stack,
  Image,
  Flex,
  useBreakpoint,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "../../Components/Form/Button";
import IoSchoolSharp from "../../assets/icons/IoSchoolSharp.svg";
import IoAddSharp from "../../assets/icons/IoAddSharp.svg";
import HiUser from "../../assets/icons/HiUser.svg";
import GoEye from "../../assets/icons/GoEye.svg";
import MdQuestionAnswer from "../../assets/icons/MdQuestionAnswer.svg";
import designer from "../../assets/images/designer.svg";

const Header = ({
  hasActionButton,
  hasGoBackButton,
  goBackLabel,
  goBackOnClick,
  title,
  img,
  children,
}) => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = breakpoint === "base";

  if (userContext.loading) return <Spinner />;

  if (!userContext.token) return null;

  return (
    <Stack w="100%">
      <Stack
        w="100%"
        mt={isMobile ? "20px" : "40px"}
        direction={isMobile && hasActionButton ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "flex-end"}
        justifyContent="space-between"
      >
        <Stack w={isMobile ? "100%" : "60%"}>
          <Text color="brand.blue.700" fontSize="xl" fontWeight="600">
            Vous êtes connecté en tant que :
          </Text>
          <Stack direction={hasActionButton || isMobile ? "column" : "row"}>
            <Stack direction="row" align="center">
              <Image src={IoSchoolSharp} alt="" />
              <Text color="brand.blue.700" fontSize="lg">
                {userContext.etablissementLabel}
              </Text>
            </Stack>
            {!hasActionButton && !isMobile && <Text mx="10px">-</Text>}
            <Stack direction="row" align="center">
              <Image src={HiUser} alt="" />
              <Text color="brand.blue.700" fontSize="lg">
                {userContext.firstName} {userContext.lastName} - {userContext.email}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        {hasActionButton && (
          <>
            <Flex
              alignItems="space-between"
              direction={isMobile ? "column" : "row"}
              w={isMobile ? "100%" : "40%"}
            >
              <Button
                isLink
                onClick={() => navigate("/questionnaires//apercu")} //TODO questionnaire preview link
                leftIcon={<Image src={GoEye} alt="" />}
                variant="outline"
                mx={isMobile ? "0" : "8px"}
                mr={isMobile ? "0" : "8px"}
                mt={isMobile ? "8px" : "0"}
                w={isMobile ? "100%" : "min-content"}
              >
                Questionnaire
              </Button>
              <Button
                isLink
                onClick={onOpen}
                leftIcon={<Image src={MdQuestionAnswer} alt="" />}
                variant="outline"
                mx={isMobile ? "0" : "8px"}
                mr={isMobile ? "0" : "8px"}
                mt={isMobile ? "8px" : "0"}
                w={isMobile ? "100%" : "min-content"}
              >
                Résultat
              </Button>
              <Button
                isLink
                onClick={() => navigate("/campagnes/ajout")}
                leftIcon={<Image src={IoAddSharp} alt="" />}
                mx={isMobile ? "0" : "8px"}
                mr={isMobile ? "0" : "8px"}
                mt={isMobile ? "8px" : "0"}
                w={isMobile ? "100%" : "min-content"}
              >
                Créer campagne
              </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
              <ModalOverlay />
              <ModalContent p="42px" bgColor="brand.blue.100" width="100%" borderRadius="20px">
                <ModalCloseButton />
                <ModalHeader color="brand.blue.700">
                  <Text fontWeight="600" fontSize="30px" mb="16px">
                    Résultats
                  </Text>
                  <Text fontWeight="600" fontSize="16px" color="brand.black.500">
                    Cette fonctionnalité de la plateforme est en cours de développement.
                  </Text>
                </ModalHeader>
                <ModalBody>
                  <Stack
                    direction="horizontal"
                    alignItems="center"
                    justifyContent="center"
                    mt="24px"
                  >
                    <Image src={designer} alt="" objectFit="contain" w="180px" mr="24px" />
                    <Text color="brand.black.500">
                      Nos équipes vous donneront très bientôt accès à la visualisation des réponses
                      du questionnaire Sirius.
                    </Text>
                  </Stack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Stack>
      <Box my={isMobile ? "24px" : "65px"}>
        {hasGoBackButton && (
          <Button variant="outline" onClick={goBackOnClick} leftIcon={<ArrowBackIcon />} mb="24px">
            {goBackLabel}
          </Button>
        )}
        <Stack direction="row" w="100%" alignItems="center">
          <Stack display="flex" direction="column" w={isMobile ? "100%" : "calc(100% - 400px)"}>
            {title && (
              <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
                {title}
              </Text>
            )}
            {children}
          </Stack>
          {img && !isMobile && <Image src={img} maxW="300px" ml="100px" alt="" />}
        </Stack>
      </Box>
    </Stack>
  );
};

export default Header;
