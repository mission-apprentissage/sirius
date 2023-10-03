import React, { useState, useContext, useRef } from "react";
import {
  Flex,
  Input,
  Button,
  Stack,
  Box,
  FormControl,
  useToast,
  FormErrorMessage,
  Textarea,
  Text,
  Image,
  useBreakpoint,
  Link,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { AsyncSelect } from "chakra-react-select";
import { _post, _get } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import { passwordComplexityRegex, passwordComplexityMessage } from "../utils/validators";
import UnderConstruction from "../assets/images/under_construction.svg";
import InputPassword from "./Components/InputPassword";
import InputText from "./Components/InputText";

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
  const breakpoint = useBreakpoint({ ssr: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [userContext] = useContext(UserContext);
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);

  const isMobile = breakpoint === "base";

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
      } else if (resultUser.statusCode === 429) {
        toast({
          title: "Une erreur est survenue",
          description: resultUser.message,
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
      <Stack
        spacing="64px"
        flexDir={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
      >
        <Image src={UnderConstruction} alt="" w="300px" />
        <Box w={isMobile ? "100%" : "400px"}>
          <Text color="brand.blue.700" fontSize="xl" my="0">
            Établissement
          </Text>
          <Text color="brand.blue.700" fontSize="3xl" fontWeight="600" my="0">
            S'inscrire
          </Text>
          {!isSuccessful ? (
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing="16px" mt="16px">
                <InputText id="firstName" name="firstName" placeholder="Prénom" formik={formik} />
                <InputText id="lastName" name="lastName" placeholder="Nom" formik={formik} />
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  formik={formik}
                />
                <InputPassword
                  handleChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                />
                <FormControl
                  isInvalid={!!formik.errors.etablissement && formik.touched.etablissement}
                  isDisabled={isLoadingRemoteEtablissement}
                >
                  <AsyncSelect
                    placeholder="SIRET de votre établissement"
                    getOptionLabel={(option) =>
                      option?.onisep_nom || option?.enseigne || option?.entreprise_raison_sociale
                    }
                    getOptionValue={(option) => option?.siret}
                    backspaceRemovesValue
                    escapeClearsValue
                    isClearable
                    loadOptions={loadEtablissementOptionsHandler}
                    isLoading={isLoadingRemoteEtablissement}
                    size="lg"
                    color="brand.black.500"
                    _placeholder={{ color: "brand.black.500" }}
                    borderColor="brand.blue.400"
                    chakraStyles={{
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: "brand.black.500",
                      }),
                      dropdownIndicator: () => ({
                        display: "none",
                      }),
                      container: (baseStyles) => ({
                        ...baseStyles,
                        borderColor: "brand.blue.400",
                      }),
                      clearIndicator: (baseStyles) => ({
                        ...baseStyles,
                        color: "brand.blue.400",
                        backgroundColor: "transparent",
                      }),
                    }}
                  />
                  <FormErrorMessage>{formik.errors.etablissement}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!formik.errors.comment && formik.touched.comment}>
                  <Textarea
                    id="comment"
                    name="comment"
                    type="text"
                    placeholder="Commentaire (facultatif)"
                    onChange={formik.handleChange}
                    value={formik.values.comment}
                    size="lg"
                    color="brand.black.500"
                    _placeholder={{ color: "brand.black.500" }}
                    borderColor="brand.blue.400"
                  />
                  <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
                </FormControl>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  mt="16px"
                >
                  <Button
                    borderRadius="md"
                    type="submit"
                    variant="solid"
                    bgColor="brand.blue.700"
                    color="white"
                    colorScheme="brand.blue"
                    width="min-content"
                    isLoading={isSubmitting}
                  >
                    Valider
                  </Button>
                  <Text color="brand.blue.700" fontSize="sm" mt={isMobile ? "32px" : "64px"}>
                    Déjà inscrit ?{" "}
                    <Link href="/connexion" textDecoration="underline">
                      Me connecter
                    </Link>
                  </Text>
                </Box>
              </Stack>
            </form>
          ) : (
            <Stack spacing={4} p="2rem">
              <Text color="brand.blue.700" textAlign="center">
                Votre demande d'inscription a bien été prise en compte, merci de bien vouloir
                cliquer sur le lien de confirmation qui vous a été envoyé par email. Nous
                vérifierons ensuite votre demande dans les plus brefs délais.
              </Text>
            </Stack>
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
