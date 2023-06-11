import React, { useState, useContext } from "react";
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
  Select,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import MonacoEditor from "@monaco-editor/react";
import { _post, _put } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";

const submitHandler = async (values, editedCampagneId, token) => {
  const isEdition = !!editedCampagneId;

  if (isEdition) {
    const result = await _put(
      `/api/campagnes/${editedCampagneId}`,
      {
        ...values,
        questionnaire: JSON.parse(values.questionnaire),
        questionnaireUI: JSON.parse(values.questionnaireUI),
      },
      token
    );

    return result.acknowledged
      ? {
          success: true,
          message: "La campagne a été mise à jour",
        }
      : {
          success: false,
        };
  } else {
    const result = await _post(
      `/api/campagnes/`,
      {
        ...values,
        questionnaire: JSON.parse(values.questionnaire),
        questionnaireUI: JSON.parse(values.questionnaireUI),
      },
      token
    );

    return result._id
      ? {
          success: true,
          message: "La campagne a été créée",
        }
      : {
          success: false,
        };
  }
};

const validationSchema = (isQuestionnaireValid, isQuestionnaireUIValid) =>
  Yup.object({
    nomCampagne: Yup.string().required("Ce champ est obligatoire"),
    cfa: Yup.string().required("Ce champ est obligatoire"),
    formation: Yup.string().required("Ce champ est obligatoire"),
    startDate: Yup.string().required("Ce champ est obligatoire"),
    endDate: Yup.string().required("Ce champ est obligatoire"),
    seats: Yup.string().required("Ce champ est obligatoire"),
    questionnaire: Yup.string()
      .required("Ce champ est obligatoire")
      .test("is-json", "Le questionnaire doit être un JSON valide", () => isQuestionnaireValid),
    questionnaireUI: Yup.string()
      .required("Ce champ est obligatoire")
      .test("is-json", "Le questionnaire doit être un JSON valide", () => isQuestionnaireUIValid),
  });

const CampagneForm = ({ campagne = null, isDuplicating = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isQuestionnaireValid, setIsQuestionnaireValid] = useState(true);
  const [isQuestionnaireUIValid, setIsQuestionnaireUIValid] = useState(true);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [questionnaireUI, setQuestionnaireUI] = useState(null);
  const [userContext] = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      nomCampagne: campagne ? campagne.nomCampagne : "",
      cfa: campagne ? campagne.cfa : "",
      formation: campagne ? campagne.formation : "",
      startDate: campagne ? campagne.startDate : "",
      endDate: campagne ? campagne.endDate : "",
      seats: campagne ? campagne.seats : "0",
      questionnaire: campagne ? JSON.stringify(campagne.questionnaire) : JSON.stringify({}),
      questionnaireUI: campagne ? JSON.stringify(campagne.questionnaireUI) : JSON.stringify({}),
    },
    validationSchema: validationSchema(isQuestionnaireValid, isQuestionnaireUIValid),
    onSubmit: async (values) => {
      const campagneId = campagne && !isDuplicating ? campagne._id : null;

      const sentQuestionnaire = questionnaire ? questionnaire : values.questionnaire;
      const sentQuestionnaireUI = questionnaireUI ? questionnaireUI : values.questionnaireUI;

      const { success, message } = await submitHandler(
        { ...values, questionnaire: sentQuestionnaire, questionnaireUI: sentQuestionnaireUI },
        campagneId,
        userContext.token
      );

      toast({
        description: success ? message : "Une erreur est survenue",
        status: success ? "success" : "error",
        duration: 5000,
        isClosable: true,
      });

      if (success && isDuplicating) {
        navigate(0);
      }

      if (success) {
        navigate("/campagnes");
      }
    },
  });

  return (
    <>
      <Flex align="center" justify="center" m="auto" width={isDuplicating ? "100%" : "80%"}>
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
              <FormControl isInvalid={!!formik.errors.cfa && formik.touched.cfa}>
                <FormLabel htmlFor="cfa">CFA</FormLabel>
                <Select
                  id="cfa"
                  name="cfa"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.cfa}
                  placeholder="Choisir un CFA"
                >
                  <option value="cfa1">CFA 1</option>
                  <option value="cfa2">CFA 2</option>
                  <option value="cfa3">CFA 3</option>
                </Select>
                <FormErrorMessage>{formik.errors.cfa}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.formation && formik.touched.formation}>
                <FormLabel htmlFor="formation">Formation</FormLabel>
                <Select
                  id="formation"
                  name="formation"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.formation}
                  placeholder="Choisir une formation"
                >
                  <option value="formation1">Formation 1</option>
                  <option value="formation2">Formation 2</option>
                  <option value="formation3">Formation 3</option>
                </Select>
                <FormErrorMessage>{formik.errors.formation}</FormErrorMessage>
              </FormControl>
              <HStack spacing={6} align="flex-start">
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
              </HStack>
              <FormControl isInvalid={!!formik.errors.seats && formik.touched.seats}>
                <FormLabel htmlFor="seats">Nombre de place</FormLabel>
                <NumberInput
                  variant="filled"
                  min="0"
                  max="100"
                  value={formik.values.seats}
                  onChange={(value) => formik.setFieldValue("seats", value)}
                  id="seats"
                  name="seats"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{formik.errors.seats}</FormErrorMessage>
              </FormControl>
              <Accordion allowToggle w="100%">
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text color={formik.errors.questionnaire ? "#E53E3E" : "currentcolor"}>
                        Questionnaire JSON
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <FormControl isInvalid={!!formik.errors.questionnaire}>
                      <MonacoEditor
                        id="questionnaire"
                        name="questionnaire"
                        language="json"
                        value={JSON.stringify(JSON.parse(formik.values.questionnaire), null, 2)}
                        theme="vs-light"
                        onChange={(value) => setQuestionnaire(value)}
                        onValidate={(markers) => {
                          if (markers.length === 0) {
                            setIsQuestionnaireValid(true);
                          } else {
                            setIsQuestionnaireValid(false);
                          }
                        }}
                        height="50vh"
                        options={{
                          minimap: {
                            enabled: false,
                          },
                          automaticLayout: true,
                        }}
                      />
                      <FormErrorMessage>{formik.errors.questionnaire}</FormErrorMessage>
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text color={formik.errors.questionnaireUI ? "#E53E3E" : "currentcolor"}>
                        Questionnaire UI JSON
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <FormControl isInvalid={!!formik.errors.questionnaireUI}>
                      <MonacoEditor
                        id="questionnaireUI"
                        name="questionnaireUI"
                        language="json"
                        value={JSON.stringify(JSON.parse(formik.values.questionnaireUI), null, 2)}
                        theme="vs-light"
                        onChange={(value) => setQuestionnaireUI(value)}
                        onValidate={(markers) => {
                          if (markers.length === 0) {
                            setIsQuestionnaireUIValid(true);
                          } else {
                            setIsQuestionnaireUIValid(false);
                          }
                        }}
                        height="50vh"
                        options={{
                          minimap: {
                            enabled: false,
                          },
                          automaticLayout: true,
                        }}
                      />
                      <FormErrorMessage>{formik.errors.questionnaireUI}</FormErrorMessage>
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Button type="submit" colorScheme="purple" width="full">
                {isDuplicating ? "Dupliquer" : "Envoyer"}
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default CampagneForm;
