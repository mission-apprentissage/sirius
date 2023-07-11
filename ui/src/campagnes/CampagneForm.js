import React, { useContext } from "react";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { _post, _put } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import QuestionnaireSelector from "./QuestionnaireSelector";

const submitHandler = async (values, editedCampagneId, token) => {
  const isEdition = !!editedCampagneId;

  if (isEdition) {
    const result = await _put(
      `/api/campagnes/${editedCampagneId}`,
      {
        ...values,
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

const validationSchema = Yup.object({
  nomCampagne: Yup.string().required("Ce champ est obligatoire"),
  cfa: Yup.string().required("Ce champ est obligatoire"),
  formation: Yup.string().required("Ce champ est obligatoire"),
  startDate: Yup.string().required("Ce champ est obligatoire"),
  endDate: Yup.string().required("Ce champ est obligatoire"),
  seats: Yup.string().required("Ce champ est obligatoire"),
  questionnaireId: Yup.string().required("Ce champ est obligatoire"),
});

const CampagneForm = ({ campagne = null, isDuplicating = false }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [userContext] = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      nomCampagne: campagne ? campagne.nomCampagne : "",
      cfa: campagne ? campagne.cfa : "",
      formation: campagne ? campagne.formation : "",
      startDate: campagne ? campagne.startDate : "",
      endDate: campagne ? campagne.endDate : "",
      seats: campagne ? campagne.seats : "0",
      questionnaireId: campagne ? campagne.questionnaireId : "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const campagneId = campagne && !isDuplicating ? campagne._id : null;

      const { success, message } = await submitHandler(
        { ...values },
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
        navigate("/campagnes/gestion");
      }
    },
  });

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
