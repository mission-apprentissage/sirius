import React, { useState, useContext, useRef, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
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
import { _post, _put, _get, _delete } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import QuestionnaireSelector from "./QuestionnaireSelector";

const validationSchema = Yup.object({
  nomCampagne: Yup.string().required("Ce champ est obligatoire"),
  formation: Yup.object().required("Ce champ est obligatoire"),
  startDate: Yup.string().required("Ce champ est obligatoire"),
  endDate: Yup.string().required("Ce champ est obligatoire"),
  seats: Yup.string().required("Ce champ est obligatoire"),
  questionnaireId: Yup.string().required("Ce champ est obligatoire"),
});

const formatOptionLabel = (props) => {
  return (
    <Box pointerEvents="none" onClick={(e) => e.preventDefault()}>
      <Text>{props.intitule_long}</Text>
      <Text fontSize="xs">
        {props.lieu_formation_adresse_computed || props.lieu_formation_adresse}
      </Text>
      <Text fontSize="xs">{props.tags.join(" - ")}</Text>
    </Box>
  );
};

const existingEtablissementsChecker = (existingEtablissements, inputSiret) =>
  existingEtablissements.find((etablissement) => etablissement.data.siret === inputSiret);

const ACTION_TYPES = {
  CREATE: "CREATE",
  EDIT: "EDIT",
  DUPLICATE: "DUPLICATE",
};

const editionSubmitHandler = async (
  values,
  previousValues,
  isUsingExistingEtablissement,
  userContext
) => {
  const { etablissement, formation, existingEtablissement, ...rest } = values;

  const hasEtablissementChanged =
    previousValues?.etablissement?._id !== etablissement?._id ||
    (isUsingExistingEtablissement &&
      existingEtablissement?._id !== previousValues?.etablissement?._id);

  const hasFormationChanged = previousValues?.formation?._id !== formation?._id;

  let etablissementResult;
  let formationResult;
  let deletedFormation;
  let etablissementWithoutPreviousFormationId;

  const campagneResult = await _put(
    `/api/campagnes/${previousValues._id}`,
    {
      ...rest,
    },
    userContext.token
  );

  if (hasFormationChanged) {
    deletedFormation = await _delete(
      `/api/formations/${previousValues.formation._id}`,
      userContext.token
    );

    formationResult = await _post(
      `/api/formations/`,
      {
        data: formation,
        campagneId: previousValues._id,
        createdBy: userContext.currentUserId,
      },
      userContext.token
    );
  }

  if (hasEtablissementChanged) {
    const formationIdsWithoutPreviousFormation = previousValues.etablissement.formationIds.filter(
      (formationId) => formationId !== previousValues.formation._id
    );

    etablissementWithoutPreviousFormationId = await _put(
      `/api/etablissements/${previousValues.etablissement._id}`,
      {
        formationIds: [...formationIdsWithoutPreviousFormation],
      },
      userContext.token
    );
    if (!isUsingExistingEtablissement) {
      etablissementResult = await _post(
        `/api/etablissements/`,
        {
          data: etablissement,
          formationIds: [formationResult._id],
          createdBy: userContext.currentUserId,
        },
        userContext.token
      );
    } else {
      etablissementResult = await _put(
        `/api/etablissements/${existingEtablissement[0]._id}`,
        {
          formationIds: [...existingEtablissement[0].formationIds, formationResult._id],
        },
        userContext.token
      );
    }
  } else {
    const formationIdsWithoutPreviousFormation = previousValues.etablissement.formationIds.filter(
      (formationId) => formationId !== previousValues.formation._id
    );

    etablissementWithoutPreviousFormationId = await _put(
      `/api/etablissements/${previousValues.etablissement._id}`,
      {
        formationIds: [...formationIdsWithoutPreviousFormation, formationResult._id],
      },
      userContext.token
    );
  }

  return (!hasEtablissementChanged && !hasFormationChanged && campagneResult.modifiedCount) ||
    (hasFormationChanged &&
      formationResult._id &&
      etablissementWithoutPreviousFormationId.modifiedCount &&
      deletedFormation.deletedCount) ||
    (hasEtablissementChanged &&
      (etablissementResult._id || etablissementResult.modifiedCount) &&
      formationResult._id &&
      deletedFormation.modifiedCount)
    ? {
        status: "success",
        description: "La campagne a été mise à jour",
      }
    : {
        status: "error",
        description: "Une erreur est survenue",
      };
};

const creationSubmitHandler = async (values, isUsingExistingEtablissement, userContext) => {
  const { etablissement, formation, existingEtablissement, ...rest } = values;

  let etablissementResult;
  const campagneResult = await _post(
    `/api/campagnes/`,
    {
      ...rest,
    },
    userContext.token
  );
  const formationResult = await _post(
    `/api/formations/`,
    {
      data: formation,
      campagneId: campagneResult._id,
      createdBy: userContext.currentUserId,
    },
    userContext.token
  );

  if (!isUsingExistingEtablissement) {
    etablissementResult = await _post(
      `/api/etablissements/`,
      {
        data: etablissement,
        formationIds: [formationResult._id],
        createdBy: userContext.currentUserId,
      },
      userContext.token
    );
  } else {
    const id = existingEtablissement[0]?._id || existingEtablissement._id;
    etablissementResult = await _put(
      `/api/etablissements/${id}`,
      {
        formationIds: [
          ...(existingEtablissement[0]?.formationIds || existingEtablissement.formationIds),
          formationResult._id,
        ],
      },
      userContext.token
    );
  }

  return campagneResult._id &&
    formationResult._id &&
    (etablissementResult._id || etablissementResult.modifiedCount)
    ? {
        status: "success",
        description: "La campagne a été créée",
      }
    : {
        status: "error",
        description: "Une erreur est survenue",
      };
};

const submitHandler = async (
  actionType,
  values,
  userContext,
  isUsingExistingEtablissement,
  previousValues
) => {
  switch (actionType) {
    case ACTION_TYPES.CREATE:
      return await creationSubmitHandler(values, isUsingExistingEtablissement, userContext);
    case ACTION_TYPES.DUPLICATE:
      return await creationSubmitHandler(values, isUsingExistingEtablissement, userContext);
    case ACTION_TYPES.EDIT:
      return await editionSubmitHandler(
        values,
        previousValues,
        isUsingExistingEtablissement,
        userContext
      );
  }
};

const getInitialValues = (campagne) => ({
  nomCampagne: campagne ? campagne.nomCampagne : "",
  etablissement: campagne ? campagne.etablissement : "",
  existingEtablissement: campagne ? campagne.etablissement : "",
  formation: campagne ? campagne.formation : "",
  startDate: campagne ? campagne.startDate : "",
  endDate: campagne ? campagne.endDate : "",
  seats: campagne ? campagne.seats : "0",
  questionnaireId: campagne ? campagne.questionnaireId : "",
});

const CampagneForm = ({ campagne = null, isDuplicating = false }) => {
  const [showAddEtablissement, setShowAddEtablissement] = useState(false);
  const [existingEtablissements, setExistingEtablissements] = useState(null);
  const [fetchedEtablissement, setFetchedEtablissement] = useState([]);
  const [isUsingExistingEtablissement, setIsUsingExistingEtablissement] = useState(null);
  const [fetchedFormations, setFetchedFormations] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [userContext] = useContext(UserContext);

  const timer = useRef();
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik({
    initialValues: getInitialValues(campagne),
    validationSchema,
    onSubmit: async (values) => {
      const { status, description } = await submitHandler(
        actionType,
        values,
        userContext,
        isUsingExistingEtablissement,
        campagne
      );

      toast({
        description,
        status,
        duration: 5000,
        isClosable: true,
      });

      if (status === "success") {
        navigate("/campagnes/gestion");
      }
    },
  });

  useEffect(() => {
    if (campagne && !isDuplicating) {
      setActionType(ACTION_TYPES.EDIT);
    }
    if (campagne && isDuplicating) {
      setActionType(ACTION_TYPES.DUPLICATE);
    }
    if (!campagne && !isDuplicating) {
      setActionType(ACTION_TYPES.CREATE);
    }
  }, [campagne, isDuplicating]);

  useEffect(() => {
    const getExistingEtablissements = async () => {
      const result = await _get(`/api/etablissements/`, userContext.token);
      setExistingEtablissements(result);
    };
    getExistingEtablissements();
  }, []);

  useEffect(() => {
    if (formik.values.existingEtablissement) {
      setIsUsingExistingEtablissement(true);
    } else {
      setIsUsingExistingEtablissement(false);
    }
  }, [formik.values.existingEtablissement]);

  useEffect(() => {
    const getFormations = async () => {
      const siret =
        fetchedEtablissement[0]?.siret || // when using new etablissement
        fetchedEtablissement[0]?.data?.siret || // when using existing etablissement
        campagne.etablissement.data.siret; // when editing

      const result = await _get(
        `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formations?query={"etablissement_gestionnaire_siret":"${siret}"}&page=1&limit=500`
      );

      // sort by alphabetical order
      const orderedFormations = result.formations.sort((a, b) =>
        a.intitule_long > b.intitule_long ? 1 : b.intitule_long > a.intitule_long ? -1 : 0
      );

      // filter by niveau
      const filteredFormations = orderedFormations.filter(
        (formation) => formation.niveau === "3 (CAP...)" || formation.niveau === "4 (BAC...)"
      );

      setFetchedFormations(filteredFormations);
    };

    // fetch when etablissement is selected or when editing
    if (
      fetchedEtablissement?.length > 0 ||
      actionType === ACTION_TYPES.EDIT ||
      actionType === ACTION_TYPES.DUPLICATE
    ) {
      getFormations();
    }
  }, [fetchedEtablissement, actionType]);

  const debouncedSiret = (value, callback) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const result = await _get(
        `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${value}"}&page=1&limit=1`
      );

      if (result.etablissements?.length > 0) {
        callback(result.etablissements);
        setFetchedEtablissement(result.etablissements);
        formik.setFieldValue("etablissement", result.etablissements[0]);
      } else {
        callback([]);
      }
    }, 500);
  };

  return (
    <Flex
      align="center"
      justify="center"
      m="auto"
      width={isDuplicating ? "100%" : "80%"}
      py={isDuplicating ? "0" : "5"}
    >
      <Box bg="white" p={6} rounded="md" w="100%" boxShadow={isDuplicating ? "none" : "md"}>
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
              isInvalid={
                !!formik.errors.existingEtablissement && formik.touched.existingEtablissement
              }
              isDisabled={showAddEtablissement}
            >
              <FormLabel htmlFor="existingEtablissement">Établissements existants</FormLabel>
              <Select
                placeholder="Sélectionner un établissement existant"
                size="md"
                options={existingEtablissements}
                getOptionLabel={(option) => option.data.onisep_nom || option.data.enseigne}
                getOptionValue={(option) => option._id}
                onChange={(option) => {
                  const value = option ? [option] : [];
                  setIsUsingExistingEtablissement(true);
                  setFetchedEtablissement(value);
                  formik.setFieldValue("existingEtablissement", value);
                  formik.setFieldValue("formation", []);
                }}
                value={
                  formik.values.existingEtablissement ||
                  (isUsingExistingEtablissement && existingEtablissements)
                }
                isSearchable
                isClearable
              />
              <FormErrorMessage>{formik.errors.existingEtablissement}</FormErrorMessage>
              <Text
                fontSize="xs"
                mt="10px"
                textDecoration="underline"
                color="purple.500"
                cursor="pointer"
                w="max-content"
                onClick={() => {
                  setFetchedEtablissement([]);
                  setShowAddEtablissement(!showAddEtablissement);
                  formik.setFieldValue("existingEtablissement", []);
                  formik.setFieldValue("etablissement", []);
                  formik.setFieldValue("formation", []);
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
              >
                <FormLabel htmlFor="etablissement">Établissement</FormLabel>
                <AsyncSelect
                  placeholder="Entrer un SIRET"
                  size="md"
                  getOptionLabel={(option) => option.onisep_nom || option.enseigne}
                  getOptionValue={(option) => option.siret}
                  backspaceRemovesValue
                  escapeClearsValue
                  loadOptions={(inputValue, callback) => {
                    const existingEtablissementFound = existingEtablissementsChecker(
                      existingEtablissements,
                      inputValue
                    );
                    if (existingEtablissementFound) {
                      setIsUsingExistingEtablissement(true);
                      setFetchedEtablissement([existingEtablissementFound]);
                      setShowAddEtablissement(false);
                      formik.setFieldValue("existingEtablissement", [existingEtablissementFound]);
                      callback([]);
                      toast({
                        description: "L'établissement existe déjà et a été sélectionné",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                      });
                    } else {
                      setIsUsingExistingEtablissement(false);
                      debouncedSiret(inputValue, callback);
                    }
                  }}
                />
                <FormErrorMessage>{formik.errors.etablissement}</FormErrorMessage>
              </FormControl>
            )}
            {(fetchedEtablissement.length || campagne?.formation?._id) && (
              <FormControl isInvalid={!!formik.errors.formation && formik.touched.formation}>
                <FormLabel htmlFor="formation">Formation</FormLabel>
                <Select
                  placeholder="Sélectionner une formation"
                  size="md"
                  options={fetchedFormations}
                  getOptionLabel={(option) =>
                    `${option.intitule_long} - ${option.tags.join(", ")} \n ${
                      option.lieu_formation_adresse_computed
                    }`
                  }
                  getOptionValue={(option) => option._id}
                  formatOptionLabel={formatOptionLabel}
                  onChange={(option) => formik.setFieldValue("formation", option)}
                  value={formik.values.formation?.data || formik.values.formation}
                  isSearchable
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
              {isDuplicating ? "Dupliquer" : "Envoyer"}
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default CampagneForm;
