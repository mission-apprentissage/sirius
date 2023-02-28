import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { _post } from "../utils/httpClient";

const validationSchema = Yup.object({
  nomCampagne: Yup.string().required("Ce champ est obligatoire"),
  cfa: Yup.string().required("Ce champ est obligatoire"),
  formation: Yup.string().required("Ce champ est obligatoire"),
  startDate: Yup.string().required("Ce champ est obligatoire"),
  endDate: Yup.string().required("Ce champ est obligatoire"),
  questionnaire: Yup.string().required("Ce champ est obligatoire"),
  questionnaireUI: Yup.string().required("Ce champ est obligatoire"),
});

const Campagnes = ({ crumbs }) => {
  const history = useHistory();
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      nomCampagne: "",
      cfa: "",
      formation: "",
      startDate: "",
      endDate: "",
      questionnaire: "",
      questionnaireUI: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const result = await _post(`/api/campagnes/`, {
        ...values,
        questionnaire: JSON.parse(values.questionnaire),
        questionnaireUI: JSON.parse(values.questionnaireUI),
      });
      if (result._id) {
        toast({
          description: "La campagne a été créée",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        history.push(`/campagnes`);
      } else {
        toast({
          title: "Une erreur est survenue",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <>
      <Flex align="center" justify="center" m="auto" width="100%">
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
              <Accordion allowToggle w="100%">
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text
                        color={
                          !!formik.errors.questionnaire && formik.touched.questionnaire ? "#E53E3E" : "currentcolor"
                        }
                      >
                        Questionnaire JSON
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <FormControl isInvalid={!!formik.errors.questionnaire && formik.touched.questionnaire}>
                      <Textarea
                        id="questionnaire"
                        name="questionnaire"
                        onChange={formik.handleChange}
                        value={formik.values.questionnaire}
                        size="sm"
                        resize="vertical"
                        rows={20}
                        variant="filled"
                      />
                      <FormErrorMessage>{formik.errors.questionnaire}</FormErrorMessage>
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text
                        color={
                          !!formik.errors.questionnaireUI && formik.touched.questionnaireUI ? "#E53E3E" : "currentcolor"
                        }
                      >
                        Questionnaire UI JSON
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <FormControl isInvalid={!!formik.errors.questionnaireUI && formik.touched.questionnaireUI}>
                      <Textarea
                        id="questionnaireUI"
                        name="questionnaireUI"
                        onChange={formik.handleChange}
                        value={formik.values.questionnaireUI}
                        size="sm"
                        resize="vertical"
                        rows={20}
                        variant="filled"
                      />
                      <FormErrorMessage>{formik.errors.questionnaireUI}</FormErrorMessage>
                    </FormControl>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Button type="submit" colorScheme="purple" width="full">
                Envoyer
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default Campagnes;
