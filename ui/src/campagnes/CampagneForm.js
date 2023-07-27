import React, { useState, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import { Select, AsyncSelect } from "chakra-react-select";
import { _get } from "../utils/httpClient";
import QuestionnaireSelector from "./QuestionnaireSelector";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalEtablissements from "../hooks/useFetchLocalEtablissements";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";

const formatOptionLabel = (props, isFormationAlreadyAdded = null) => {
  props.isDisabled = isFormationAlreadyAdded;
  return (
    <Box>
      <Text>{props.intitule_long}</Text>
      <Text fontSize="xs">
        {props.lieu_formation_adresse_computed || props.lieu_formation_adresse}
      </Text>
      <Text fontSize="xs">{props.tags?.join(" - ")}</Text>
    </Box>
  );
};

const localEtablissementsChecker = (localEtablissements, inputSiret) =>
  localEtablissements.find((etablissement) => etablissement.data.siret === inputSiret);

const CampagneForm = ({ formik, buttonMessage }) => {
  const [showAddEtablissement, setShowAddEtablissement] = useState(false);
  const [inputSiret, setInputSiret] = useState(null);
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);
  const timer = useRef();
  const toast = useToast();

  const [fetchedLocalEtablissements, loadingLocalEtablissements, errorLocalEtablissements] =
    useFetchLocalEtablissements();
  const [fetchedRemoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(inputSiret || formik.values.localEtablissement?.data?.siret);

  const localFormationQuery = formik.values.localEtablissement?.formationIds
    ?.map((id) => `id=${id}`)
    .join("&");

  const [fetchedLocalFormations] = useFetchLocalFormations(localFormationQuery);

  const debouncedSiret = (callback, siret) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const result = await _get(
        `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${siret}"}&page=1&limit=1`
      );

      if (result.etablissements?.length > 0) {
        callback(result.etablissements);
        formik.setFieldValue("etablissement", result.etablissements[0]);
      } else {
        callback(null);
      }
    }, 500);
  };

  const loadEtablissementOptionsHandler = (inputValue, callback) => {
    setIsLoadingRemoteEtablissement(true);
    const localEtablissementFound = localEtablissementsChecker(
      fetchedLocalEtablissements,
      inputValue
    );
    if (localEtablissementFound) {
      setShowAddEtablissement(false);
      formik.setFieldValue("localEtablissement", localEtablissementFound);
      callback(null);
      toast({
        description: "L'établissement existe déjà et a été sélectionné",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setIsLoadingRemoteEtablissement(false);
    } else {
      setInputSiret(inputValue);
      debouncedSiret(callback, inputValue);
      setIsLoadingRemoteEtablissement(false);
    }
  };

  if (errorLocalEtablissements || errorRemoteFormations) {
    toast({
      title: "Une erreur s'est produite",
      description: errorLocalEtablissements?.message || errorRemoteFormations?.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Flex align="center" justify="center" m="auto" width="80%" py="5">
      <Box bg="white" p={6} rounded="md" w="100%" boxShadow="md">
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing={6} align="flex-start">
            <FormControl isInvalid={!!formik.errors.nomCampagne && formik.touched.nomCampagne}>
              <FormLabel htmlFor="nomCampagne">Nom de la campagne</FormLabel>
              <Input
                id="nomCampagne"
                name="nomCampagne"
                type="text"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.nomCampagne}
              />
              <FormErrorMessage>{formik.errors.nomCampagne}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!formik.errors.localEtablissement && formik.touched.localEtablissement}
              isDisabled={
                showAddEtablissement || loadingLocalEtablissements || errorLocalEtablissements
              }
            >
              <FormLabel htmlFor="localEtablissements">Établissements existants</FormLabel>
              <Select
                placeholder="Sélectionner un établissement existant"
                size="md"
                options={fetchedLocalEtablissements}
                getOptionLabel={(option) => option?.data?.onisep_nom || option?.data?.enseigne}
                getOptionValue={(option) => option?._id}
                onChange={(option) => {
                  formik.setFieldValue("localEtablissement", option);
                  formik.setFieldValue("formation", null);
                }}
                value={formik.values.localEtablissement}
                isLoading={loadingLocalEtablissements}
                isSearchable
                isClearable
              />
              <FormErrorMessage>{formik.errors.localEtablissement}</FormErrorMessage>
              <Text
                fontSize="xs"
                mt="10px"
                textDecoration="underline"
                color="purple.500"
                cursor="pointer"
                w="max-content"
                onClick={() => {
                  setShowAddEtablissement(!showAddEtablissement);
                  formik.setFieldValue("localEtablissement", null);
                  formik.setFieldValue("etablissement", null);
                  formik.setFieldValue("formation", null);
                }}
              >
                {showAddEtablissement
                  ? "Choisir un établissement existant"
                  : "Ajouter un établissement"}
              </Text>
            </FormControl>
            {showAddEtablissement && (
              <FormControl
                isInvalid={!!formik.errors.etablissement && formik.touched.etablissement}
                isDisabled={isLoadingRemoteEtablissement}
              >
                <FormLabel htmlFor="etablissement">Établissement</FormLabel>
                <AsyncSelect
                  placeholder="Entrer un SIRET"
                  size="md"
                  getOptionLabel={(option) => option?.onisep_nom || option?.enseigne}
                  getOptionValue={(option) => option?.siret}
                  backspaceRemovesValue
                  escapeClearsValue
                  isClearable
                  loadOptions={loadEtablissementOptionsHandler}
                  isLoading={isLoadingRemoteEtablissement}
                />
                <FormErrorMessage>{formik.errors.etablissement}</FormErrorMessage>
              </FormControl>
            )}
            {(formik.values.localEtablissement || formik.values.etablissement) && (
              <FormControl
                isInvalid={!!formik.errors.formation && formik.touched.formation}
                isDisabled={loadingRemoteFormations || errorRemoteFormations}
              >
                <FormLabel htmlFor="formation">Formation</FormLabel>
                <Select
                  placeholder="Sélectionner une formation"
                  size="md"
                  options={fetchedRemoteFormations}
                  getOptionLabel={(option) =>
                    `${option.intitule_long} - ${option.tags.join(", ")} \n ${
                      option.lieu_formation_adresse_computed
                    }`
                  }
                  getOptionValue={(option) => option._id}
                  formatOptionLabel={(props) => {
                    const initialFormationId = formik.initialValues.formation._id;
                    // allow same formaiton in edition mode
                    if (!initialFormationId) {
                      const localFormationIds = fetchedLocalFormations?.map(
                        (formation) => formation.data._id
                      );

                      const isFormationAlreadyAdded = localFormationIds?.includes(props.id);
                      return formatOptionLabel(props, isFormationAlreadyAdded);
                    }
                    return formatOptionLabel(props);
                  }}
                  onChange={(option) => formik.setFieldValue("formation", option)}
                  value={formik.values.formation?.data || formik.values.formation}
                  isSearchable
                  isLoading={loadingRemoteFormations}
                />
                <FormErrorMessage>{formik.errors.formation}</FormErrorMessage>
              </FormControl>
            )}
            <HStack spacing={6} align="flex-start" alignItems="center">
              <FormControl isInvalid={!!formik.errors.startDate && formik.touched.startDate}>
                <FormLabel htmlFor="startDate">Date de début</FormLabel>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  onChange={formik.handleChange}
                  value={formik.values.startDate}
                />
                <FormErrorMessage>{formik.errors.startDate}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.endDate && formik.touched.endDate}>
                <FormLabel htmlFor="startDate">Date de fin</FormLabel>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  onChange={formik.handleChange}
                  value={formik.values.endDate}
                />
                <FormErrorMessage>{formik.errors.endDate}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.seats && formik.touched.seats}>
                <FormLabel htmlFor="seats">Nombre de place</FormLabel>
                <NumberInput
                  id="seats"
                  name="seats"
                  min="0"
                  max="100"
                  size="sm"
                  variant="filled"
                  onChange={(value) => formik.setFieldValue("seats", value)}
                  value={formik.values.seats}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{formik.errors.seats}</FormErrorMessage>
              </FormControl>
            </HStack>
            <FormControl
              isInvalid={!!formik.errors.questionnaireId && formik.touched.questionnaireId}
            >
              <FormLabel htmlFor="questionnaireId">Template de questionnaire</FormLabel>
              <QuestionnaireSelector
                questionnaireSetter={formik.setFieldValue}
                questionnaireId={formik.values.questionnaireId}
              />
              <FormErrorMessage>{formik.errors.questionnaireId}</FormErrorMessage>
            </FormControl>
            <Button type="submit" colorScheme="purple" width="full">
              {buttonMessage}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default CampagneForm;
