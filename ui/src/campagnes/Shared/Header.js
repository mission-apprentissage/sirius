import React, { useContext } from "react";
import { Box, Spinner, Text, Stack, Image, Flex, useBreakpoint, Tooltip } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserContext";
import { EtablissementsContext } from "../../context/EtablissementsContext";
import Button from "../../Components/Form/Button";
import { useGet } from "../../common/hooks/httpHooks";
import IoSchoolSharp from "../../assets/icons/IoSchoolSharp.svg";
import IoAddSharp from "../../assets/icons/IoAddSharp.svg";
import HiUser from "../../assets/icons/HiUser.svg";
import GoEye from "../../assets/icons/GoEye.svg";
import MdDone from "../../assets/icons/MdDone.svg";
import MdQuestionAnswer from "../../assets/icons/MdQuestionAnswer.svg";
import { etablissementLabelGetter } from "../../utils/etablissement";

const MultiEtablissementsPicker = ({ etablissementsContext, setEtablissementsContext }) => {
  const [_, setSearchParams] = useSearchParams();

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

    setSearchParams({});
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

  const customFilterOption = (option, inputValue) => {
    const inputLowerCase = inputValue.toLowerCase();
    const labelMatch = option.data.label.toLowerCase().includes(inputLowerCase);
    const valueMatch = option.value.toLowerCase().includes(inputLowerCase);
    return labelMatch || valueMatch;
  };

  return (
    <Box minWidth="300px">
      <Select
        id="etablissement"
        name="etablissement"
        variant="outline"
        size="lg"
        placeholder="Choix de l'établissement"
        isSearchable
        defaultValue={defaultValue}
        filterOption={customFilterOption}
        getOptionLabel={(option) => (
          <Box>
            <p>{option.label}</p>
            <Text fontSize="xs">{option.value}</Text>
          </Box>
        )}
        options={
          etablissementsContext.etablissements.length > 0 &&
          etablissementsContext.etablissements.map((etablissement) => ({
            value: etablissement.siret,
            label: etablissementLabelGetter(etablissement),
          }))
        }
        onChange={onChangeHandler}
      />
    </Box>
  );
};

const CampagnePicker = ({ campagnes, loadingCampagnes, searchParams, setSearchParams }) => {
  const options =
    !loadingCampagnes &&
    campagnes.length > 0 &&
    campagnes.map((campagne) => ({
      value: campagne._id,
      label: campagne.nomCampagne || campagne.formation.data.intitule_long,
    }));

  return (
    <Select
      id="campagne"
      name="campagne"
      variant="outline"
      size="lg"
      placeholder="Choix de le campagne"
      isSearchable
      onChange={(e) => (e?.value ? setSearchParams({ campagneId: e.value }) : setSearchParams({}))}
      options={options}
      isDisabled={loadingCampagnes || campagnes.length === 0}
      isClearable
      onClear={() => setSearchParams({})}
      value={
        searchParams.get("campagneId")
          ? {
              value: searchParams.get("campagneId"),
              label:
                campagnes?.find((campagne) => campagne._id === searchParams.get("campagneId"))
                  ?.nomCampagne ||
                campagnes?.find((campagne) => campagne._id === searchParams.get("campagneId"))
                  ?.formation.data.intitule_long,
            }
          : null
      }
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
  hasCampagneSelector = false,
  campagnes = [],
  loadingCampagnes = false,
}) => {
  const [userContext] = useContext(UserContext);
  const [etablissementsContext, setEtablissementsContext] = useContext(EtablissementsContext);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const [searchParams, setSearchParams] = useSearchParams();
  const campagneId = searchParams.get("campagneId");

  const isMobile = breakpoint === "base";

  if (userContext.loading) return <Spinner />;

  if (!userContext.token) return null;

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const selectedCampagne = campagnes?.find((campagne) => campagne._id === campagneId);

  const isSelectedCampagneEnded =
    selectedCampagne && new Date(selectedCampagne.endDate) < new Date();

  return (
    <Stack w="100%">
      <Stack
        w="100%"
        mt={isMobile ? "20px" : "40px"}
        direction={isMobile && hasActionButton ? "column" : "row"}
        alignItems={isMobile || hasCampagneSelector ? "flex-start" : "flex-end"}
        justifyContent="space-between"
      >
        <Stack w={isMobile || (!hasActionButton && !hasCampagneSelector) ? "100%" : "60%"}>
          <Text color="brand.blue.700" fontSize="xl" fontWeight="600">
            Vous êtes connecté en tant que :
          </Text>
          <Stack direction={hasActionButton || hasCampagneSelector || isMobile ? "column" : "row"}>
            <Stack direction="row" align="center">
              <Image src={IoSchoolSharp} alt="" />
              {etablissementsContext.etablissements?.length > 1 && allowEtablissementChange ? (
                <MultiEtablissementsPicker
                  etablissementsContext={etablissementsContext}
                  setEtablissementsContext={setEtablissementsContext}
                />
              ) : (
                <Text color="brand.blue.700" fontSize="lg">
                  {etablissementsContext.etablissementLabel}
                </Text>
              )}
            </Stack>
            {!hasActionButton && !hasCampagneSelector && !isMobile && <Text mx="10px">-</Text>}
            <Stack direction="row" align="center">
              <Image src={HiUser} alt="" />
              <Text color="brand.blue.700" fontSize="lg">
                {userContext.firstName} {userContext.lastName} - {userContext.email}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        {hasActionButton && (
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
              onClick={() => navigate("/campagnes/resultats")}
              leftIcon={<Image src={MdQuestionAnswer} alt="" />}
              variant="outline"
              mx={isMobile ? "0" : "8px"}
              mr={isMobile ? "0" : "8px"}
              mt={isMobile ? "8px" : "0"}
              w={isMobile ? "100%" : "min-content"}
            >
              Résultats
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
        )}
        {hasCampagneSelector && (
          <Flex alignItems="space-between" direction="column" w={isMobile ? "100%" : "40%"}>
            <Text color="brand.blue.700" fontSize="xl" fontWeight="600" mb="15px">
              Sélectionnez une campagne pour voir ses résultats
            </Text>
            <CampagnePicker
              campagnes={campagnes}
              loadingCampagnes={loadingCampagnes}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
            {selectedCampagne &&
              (!isSelectedCampagneEnded ? (
                <Text color="brand.blue.700" mt="16px">
                  Cette campagne se terminera le{" "}
                  <Text as="span" fontWeight="600">
                    {new Date(selectedCampagne?.endDate).toLocaleDateString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}
                  </Text>
                </Text>
              ) : (
                <Text color="#297254" mt="16px" display="flex" alignItems="center">
                  <Image src={MdDone} alt="" mr="8px" />
                  Campagne terminé depuis le{" "}
                  <Text as="span" fontWeight="600" ml="3px">
                    {new Date(selectedCampagne?.endDate).toLocaleDateString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}
                  </Text>
                </Text>
              ))}
          </Flex>
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
