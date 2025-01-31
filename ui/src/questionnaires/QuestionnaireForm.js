import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import MonacoEditor from "@monaco-editor/react";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { UserContext } from "../context/UserContext";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import { apiPost, apiPut } from "../utils/api.utils";

const submitHandler = async (values, editedQuestionnaireId, userContext) => {
  const isEdition = !!editedQuestionnaireId;

  if (isEdition) {
    const result = await apiPut(`/api/questionnaires/:id`, {
      params: { id: editedQuestionnaireId },
      body: {
        ...values,
        questionnaire: JSON.parse(values.questionnaire),
        questionnaireUI: JSON.parse(values.questionnaireUI),
      },
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });

    return result.acknowledged
      ? {
          success: true,
          message: "Le questionnaire a été mise à jour",
        }
      : {
          success: false,
        };
  } else {
    const result = await apiPost("/questionnaires", {
      body: {
        ...values,
        questionnaire: JSON.parse(values.questionnaire),
        questionnaireUI: JSON.parse(values.questionnaireUI),
        createdBy: userContext.user.id,
      },
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });

    return result.id
      ? {
          success: true,
          message: "Le questionnaire a été créée",
        }
      : {
          success: false,
        };
  }
};

const validationSchema = (isQuestionnaireValid, isQuestionnaireUIValid) =>
  Yup.object({
    nom: Yup.string().required("Ce champ est obligatoire"),
    isValidated: Yup.boolean().default(false),
    questionnaire: Yup.string()
      .required("Ce champ est obligatoire")
      .test("is-json", "Le questionnaire doit être un JSON valide", () => isQuestionnaireValid),
    questionnaireUI: Yup.string()
      .required("Ce champ est obligatoire")
      .test("is-json", "Le questionnaire doit être un JSON valide", () => isQuestionnaireUIValid),
  });

const QuestionnaireForm = ({ editedQuestionnaire = null, duplicatedQuestionnaire = null }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isQuestionnaireValid, setIsQuestionnaireValid] = useState(true);
  const [isQuestionnaireUIValid, setIsQuestionnaireUIValid] = useState(true);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [questionnaireUI, setQuestionnaireUI] = useState(null);
  const [userContext] = useContext(UserContext);

  const helmet = useSetAndTrackPageTitle({
    title: `${editedQuestionnaire ? "Éditer" : "Ajouter"} un questionnaire - Sirius`,
  });

  const currentQuestionnaire = duplicatedQuestionnaire ? duplicatedQuestionnaire : editedQuestionnaire;

  const isDuplicating = !!duplicatedQuestionnaire;

  const formik = useFormik({
    initialValues: {
      nom: currentQuestionnaire ? currentQuestionnaire.nom : "",
      isValidated: currentQuestionnaire ? currentQuestionnaire.isValidated : false,
      questionnaire: JSON.stringify(currentQuestionnaire?.questionnaire || {}),
      questionnaireUI: JSON.stringify(currentQuestionnaire?.questionnaireUI || {}),
    },
    validationSchema: validationSchema(isQuestionnaireValid, isQuestionnaireUIValid),
    onSubmit: async (values) => {
      const questionnaireId = currentQuestionnaire && !isDuplicating ? currentQuestionnaire.id : null;

      const sentQuestionnaire = questionnaire ? questionnaire : values.questionnaire;
      const sentQuestionnaireUI = questionnaireUI ? questionnaireUI : values.questionnaireUI;

      const { success, message } = await submitHandler(
        { ...values, questionnaire: sentQuestionnaire, questionnaireUI: sentQuestionnaireUI },
        questionnaireId,
        userContext
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
        navigate("/questionnaires/gestion");
      }
    },
  });

  return (
    <>
      {helmet}
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
                <FormLabel htmlFor="nomCampagne">Nom du questionnaire</FormLabel>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.nom}
                />
                <FormErrorMessage>{formik.errors.nom}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.isValidated && formik.touched.isValidated}>
                <HStack>
                  <FormLabel htmlFor="isValidated">Validé</FormLabel>
                  <Switch
                    id="isValidated"
                    name="isValidated"
                    isChecked={formik.values.isValidated}
                    onChange={formik.handleChange}
                  />
                </HStack>
                <FormErrorMessage>{formik.errors.isValidated}</FormErrorMessage>
              </FormControl>
              <Accordion allowToggle w="100%">
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text color={formik.errors.questionnaire ? "#E53E3E" : "currentcolor"}>Questionnaire JSON</Text>
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

export default QuestionnaireForm;
