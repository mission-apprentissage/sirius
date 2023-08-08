import React, { useState } from "react";
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
} from "@chakra-ui/react";
import QuestionnaireSelector from "./QuestionnaireSelector";
import EtablissementPicker from "./Components/EtablissementPicker";
import FormationPicker from "./Components/FormationPicker";

const CampagneForm = ({ formik, buttonMessage, siret }) => {
  const [inputSiret, setInputSiret] = useState(null);

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
            <EtablissementPicker formik={formik} setInputSiret={setInputSiret} siret={siret} />
            <FormationPicker formik={formik} inputSiret={inputSiret} />
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
