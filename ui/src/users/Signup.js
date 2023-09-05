import React, { useState, useContext, useRef } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
  useToast,
  FormErrorMessage,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { AsyncSelect } from "chakra-react-select";
import { _post, _get } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import { passwordComplexityRegex, passwordComplexityMessage } from "../utils/validators";
import Miley from "../assets/images/miley.png";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Le champ n'est pas au bon format")
    .required("Ce champ est obligatoire"),
  lastName: Yup.string().required("Ce champ est obligatoire"),
  firstName: Yup.string().required("Ce champ est obligatoire"),
  etablissement: Yup.object().required("Ce champ est obligatoire"),
  comment: Yup.string(),
  password: Yup.string()
    .required("Ce champ est obligatoire")
    .matches(passwordComplexityRegex, passwordComplexityMessage),
});

const Signup = () => {
  const timer = useRef();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [userContext] = useContext(UserContext);
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      etablissement: "",
      comment: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password, firstName, lastName, comment, etablissement }) => {
      setIsSubmitting(true);
      const resultUser = await _post(`/api/users/`, {
        firstName: firstName,
        lastName: lastName,
        comment: comment,
        email: email.toLowerCase(),
        password,
        siret: etablissement.siret,
        etablissement: etablissement,
      });

      if (resultUser._id) {
        setIsSuccessful(true);
        setIsSubmitting(false);
      } else if (resultUser.statusCode === 400) {
        toast({
          title: "Une erreur est survenue",
          description: resultUser.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      } else if (resultUser.statusCode === 500) {
        toast({
          title: "Une erreur est survenue",
          description: "Merci de réessayer",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      }
    },
  });

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
    debouncedSiret(callback, inputValue);
    setIsLoadingRemoteEtablissement(false);
  };

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" w="100%">
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar size="lg" src={Miley} alt="" />
        <Heading color="purple.400">S'inscrire en tant qu'établissement</Heading>
        <Box w="600px">
          {!isSuccessful ? (
            <form onSubmit={formik.handleSubmit}>
              <Stack
                spacing={4}
                p="2rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
                borderRadius="md"
              >
                <FormControl isInvalid={!!formik.errors.firstName && formik.touched.firstName}>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Prénom"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                  />
                  <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.lastName && formik.touched.lastName}>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Nom"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                  />
                  <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
                  <InputGroup>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <InputRightElement mr="5px">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!formik.errors.etablissement && formik.touched.etablissement}
                  isDisabled={isLoadingRemoteEtablissement}
                >
                  <AsyncSelect
                    placeholder="Entrez le SIRET de votre établissement"
                    size="md"
                    getOptionLabel={(option) =>
                      option?.onisep_nom || option?.enseigne || option?.entreprise_raison_sociale
                    }
                    getOptionValue={(option) => option?.siret}
                    backspaceRemovesValue
                    escapeClearsValue
                    isClearable
                    loadOptions={loadEtablissementOptionsHandler}
                    isLoading={isLoadingRemoteEtablissement}
                  />
                  <FormErrorMessage>{formik.errors.etablissement}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.comment && formik.touched.comment}>
                  <Textarea
                    id="comment"
                    name="comment"
                    type="text"
                    placeholder="Commentaire"
                    onChange={formik.handleChange}
                    value={formik.values.comment}
                  />
                  <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
                </FormControl>
                <Button
                  borderRadius="md"
                  type="submit"
                  variant="solid"
                  colorScheme="purple"
                  width="full"
                  isLoading={isSubmitting}
                >
                  Inscription
                </Button>
              </Stack>
            </form>
          ) : (
            <Stack
              spacing={4}
              p="2rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              borderRadius="md"
            >
              <Text color="purple.500" textAlign="center">
                Votre demande d'inscription a bien été prise en compte, nous la traiterons dans les
                plus brefs délais.
              </Text>
            </Stack>
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
