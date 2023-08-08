import React, { useState } from "react";
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
import { Select } from "chakra-react-select";
import QuestionnaireSelector from "./QuestionnaireSelector";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";
import EtablissementPicker from "./Components/EtablissementPicker";

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

const CampagneForm = ({ formik, buttonMessage, siret }) => {
  const [inputSiret, setInputSiret] = useState(null);
  const toast = useToast();

  const [fetchedRemoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(inputSiret || formik.values.localEtablissement?.data?.siret);

  const localFormationQuery = formik.values.localEtablissement?.formationIds
    ?.filter(Boolean)
    ?.map((id) => `id=${id}`)
    .join("&");

  const [fetchedLocalFormations] = useFetchLocalFormations(localFormationQuery);

  if (errorRemoteFormations) {
    toast({
      title: "Une erreur s'est produite",
      description: errorRemoteFormations?.message,
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
            <EtablissementPicker formik={formik} setInputSiret={setInputSiret} />
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
                    const initialFormationId = formik.initialValues.formation?._id;
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
