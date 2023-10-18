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
  Tooltip,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserContext";
import { EtablissementsContext } from "../../context/EtablissementsContext";
import Button from "../../Components/Form/Button";
import { useGet } from "../../common/hooks/httpHooks";
import IoSchoolSharp from "../../assets/icons/IoSchoolSharp.svg";
import IoAddSharp from "../../assets/icons/IoAddSharp.svg";
import HiUser from "../../assets/icons/HiUser.svg";
import GoEye from "../../assets/icons/GoEye.svg";
import MdQuestionAnswer from "../../assets/icons/MdQuestionAnswer.svg";
import designer from "../../assets/images/designer.svg";
import { etablissementLabelGetter } from "../../utils/etablissement";

const MultiEtablissementsPicker = ({ etablissementsContext, setEtablissementsContext }) => {
  if (!etablissementsContext.etablissements?.length) return null;

  const defaultValue = etablissementsContext.siret
    ? {
        value: etablissementsContext.siret,
        label: etablissementLabelGetter(
          etablissementsContext.etablissements.find(
            (etablissement) => etablissement.siret === etablissementsContext.siret
          )
        ),
      }
    : {
        value: etablissementsContext.etablissements[0].siret,
        label: etablissementLabelGetter(etablissementsContext.etablissements[0]),
      };

  const onChangeHandler = ({ value }) => {
    const persistedEtablissements = JSON.parse(localStorage.getItem("etablissements"));

    const etablissement = persistedEtablissements.etablissements.find(
      (etablissement) => etablissement.siret === value
    );

    setEtablissementsContext({
      ...etablissementsContext,
      siret: value,
      etablissementLabel: etablissementLabelGetter(etablissement),
    });
    localStorage.setItem(
      "etablissements",
      JSON.stringify({
        siret: value,
        etablissementLabel: etablissementLabelGetter(etablissement),
        etablissements: persistedEtablissements.etablissements,
      })
    );
  };

  return (
    <Select
      id="etablissement"
      name="etablissement"
      variant="outline"
      size="lg"
      placeholder="Choix de l'établissement"
      isSearchable
      defaultValue={defaultValue}
      options={
        etablissementsContext.etablissements.length > 0 &&
        etablissementsContext.etablissements.map((etablissement) => ({
          value: etablissement.siret,
          label: etablissementLabelGetter(etablissement),
        }))
      }
      onChange={onChangeHandler}
    />
  );
};

const Header = ({
  hasActionButton,
  hasGoBackButton,
  goBackLabel,
  goBackOnClick,
  title,
  img,
  children,
  allCampagneCreated = false,
  allowEtablissementChange = false,
}) => {
  const [userContext] = useContext(UserContext);
  const [etablissementsContext, setEtablissementsContext] = useContext(EtablissementsContext);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = breakpoint === "base";

  if (userContext.loading) return <Spinner />;

  if (!userContext.token) return null;

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  return (
    <Stack w="100%">
      <Stack
        w="100%"
        mt={isMobile ? "20px" : "40px"}
        direction={isMobile && hasActionButton ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "flex-end"}
        justifyContent="space-between"
      >
        <Stack w={isMobile || !hasActionButton ? "100%" : "60%"}>
          <Text color="brand.blue.700" fontSize="xl" fontWeight="600">
            Vous êtes connecté en tant que :
          </Text>
          <Stack direction={hasActionButton || isMobile ? "column" : "row"}>
            <Stack direction="row" align="center">
              <Image src={IoSchoolSharp} alt="" />
              {etablissementsContext.etablissements?.length === 1 || !allowEtablissementChange ? (
                <Text color="brand.blue.700" fontSize="lg">
                  {etablissementsContext.etablissementLabel}
                </Text>
              ) : (
                <MultiEtablissementsPicker
                  etablissementsContext={etablissementsContext}
                  setEtablissementsContext={setEtablissementsContext}
                />
              )}
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
                onClick={() =>
                  navigate(
                    `/questionnaires/${
                      validatedQuestionnaire?.length && validatedQuestionnaire[0]._id
                    }/apercu`
                  )
                }
                target="_blank"
                leftIcon={<Image src={GoEye} alt="" />}
                variant="outline"
                mx={isMobile ? "0" : "8px"}
                mr={isMobile ? "0" : "8px"}
                mt={isMobile ? "8px" : "0"}
                w={isMobile ? "100%" : "min-content"}
                isLoading={loadingQuestionnaires}
                isDisabled={errorQuestionnaires || validatedQuestionnaire?.length === 0}
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
                isDisabled={allCampagneCreated}
              >
                <Tooltip
                  label={<Text>Toutes les campagnes ont été créées.</Text>}
                  position="bottom"
                  isDisabled={!allCampagneCreated}
                >
                  Créer campagne
                </Tooltip>
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
