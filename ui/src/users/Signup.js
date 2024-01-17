import React, { useState, useContext } from "react";
import {
  Flex,
  Stack,
  Box,
  FormControl,
  Textarea,
  Text,
  Image,
  useBreakpoint,
  Link,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import { passwordComplexityRegex, passwordComplexityMessage } from "../utils/validators";
import Support from "../assets/images/support.svg";
import SiriusInTheSky from "../assets/images/sirius_in_the_sky.svg";
import InputPassword from "../Components/Form/InputPassword";
import InputText from "../Components/Form/InputText";
import Button from "../Components/Form/Button";
import FormError from "../Components/Form/FormError";
import { emailWithTLDRegex } from "../constants";
import EtablissementInput from "./Components/EtablissementInput";
import { etablissementLabelGetter } from "../utils/etablissement";

const requiredFieldMessage = "Ces champs sont obligatoires";

const etablissement = Yup.object({
  siret: Yup.string().required(),
  onisep_nom: Yup.string().nullable(),
  enseigne: Yup.string().nullable(),
  entreprise_raison_sociale: Yup.string().nullable(),
});

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailWithTLDRegex, "L'email n'est pas au bon format")
    .required(requiredFieldMessage),
  lastName: Yup.string().required(requiredFieldMessage),
  firstName: Yup.string().required(requiredFieldMessage),
  comment: Yup.string(),
  password: Yup.string()
    .required(requiredFieldMessage)
    .matches(passwordComplexityRegex, passwordComplexityMessage),
  etablissements: Yup.array().of(etablissement).min(1, requiredFieldMessage),
});

const Signup = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);
  const [addNewSiret, setAddNewSiret] = useState(true);

  const isMobile = breakpoint === "base";

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      comment: "",
      email: "",
      password: "",
      etablissements: [],
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password, firstName, lastName, comment, etablissements }) => {
      setIsSubmitting(true);
      const etablissementsWitoutEmpty = etablissements.filter(
        (obj) => Object.keys(obj).length !== 0
      );
      const resultUser = await _post(`/api/users/`, {
        firstName: firstName,
        lastName: lastName,
        comment: comment,
        email: email.toLowerCase(),
        password,
        etablissements: etablissementsWitoutEmpty.map((etablissement) => ({
          siret: etablissement.siret,
          onisep_nom: etablissement.onisep_nom,
          enseigne: etablissement.enseigne,
          entreprise_raison_sociale: etablissement.entreprise_raison_sociale,
        })),
      });

      if (resultUser._id) {
        setError(null);
        setIsSuccessful(true);
        setIsSubmitting(false);
      } else if (resultUser.statusCode === 400) {
        setError(resultUser.message);
        setIsSubmitting(false);
      } else if (resultUser.statusCode === 500) {
        setError("Merci de réessayer");
        setIsSubmitting(false);
      } else if (resultUser.statusCode === 429) {
        setError(resultUser.message);
        setIsSubmitting(false);
      }
    },
  });

  const etablissements = formik.values.etablissements;

  const handleDeleteEtablissement = (index) => {
    const updatedEtablissements = [...etablissements];
    updatedEtablissements.splice(index, 1);
    formik.setFieldValue("etablissements", updatedEtablissements);
  };

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" w="100%" mt="15px">
      <Stack
        spacing="64px"
        flexDir={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
      >
        <Image src={isSuccessful ? SiriusInTheSky : Support} alt="" w="300px" />
        <Box w={isMobile ? "100%" : "400px"}>
          {!isSuccessful && (
            <Text color="brand.blue.700" fontSize="xl" my="0">
              Établissement
            </Text>
          )}
          <Text color="brand.blue.700" fontSize="3xl" fontWeight="600" my="0">
            {isSuccessful ? "Inscription enregistrée !" : "S'inscrire"}
          </Text>
          <FormError
            title="L'inscription a échouée"
            hasError={(Object.keys(formik.errors).length && formik.submitCount) || error}
            errorMessages={[...new Set(Object.values(formik.errors)), error]}
          />
          {!isSuccessful ? (
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing="16px" mt="16px">
                <InputText
                  id="firstName"
                  name="firstName"
                  placeholder="Prénom"
                  formik={formik}
                  noErrorMessage
                />
                <InputText
                  id="lastName"
                  name="lastName"
                  placeholder="Nom"
                  formik={formik}
                  noErrorMessage
                />
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  formik={formik}
                  noErrorMessage
                />
                <InputPassword id="password" name="password" formik={formik} noErrorMessage />
                <Text fontSize="14px">
                  Si votre position vous le permet, ajoutez plus d’un SIRET pour suivre les
                  campagnes de plusieurs établissements. Insérez le premier SIRET puis cliquez sur
                  le bouton « Ajouter un SIRET ».
                </Text>
                {etablissements.length &&
                  etablissements.map((etablissement, index) => (
                    <Stack direction="row" key={index}>
                      <Box bgColor="brand.blue.100" p="15px" position="relative" w="100%">
                        <Box
                          bgColor="brand.pink.400"
                          borderRadius="50px"
                          w="20px"
                          h="20px"
                          position="absolute"
                          top="6px"
                          left="6px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="12px" fontWeight="semibold">
                            {index + 1}
                          </Text>
                        </Box>
                        <Box
                          w="20px"
                          h="20px"
                          position="absolute"
                          top="6px"
                          right="6px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <DeleteIcon
                            cursor="pointer"
                            color="brand.red.500"
                            onClick={() => handleDeleteEtablissement(index)}
                          />
                        </Box>
                        <Text mt="25px" mb="5px" fontWeight="semibold">
                          {etablissementLabelGetter(etablissement)}
                        </Text>
                        <Text mb="5px" fontSize="14px">
                          {etablissement.siret}
                        </Text>
                        <Text mb="10px" fontSize="14px">
                          {etablissement.adresse}
                        </Text>
                        <Link
                          href={`https://catalogue-apprentissage.intercariforef.org/etablissement/${etablissement.id}`}
                          target="_blank"
                          display="flex"
                          alignItems="center"
                          color={"brand.blue.700"}
                          fontSize="12px"
                        >
                          <ExternalLinkIcon mr="5px" color={"brand.blue.700"} />
                          Voir le détail de l'établissement (CARIF-OREF)
                        </Link>
                      </Box>
                    </Stack>
                  ))}
                {(addNewSiret || !etablissements.length) && (
                  <EtablissementInput
                    formik={formik}
                    setError={setError}
                    setAddNewSiret={setAddNewSiret}
                  />
                )}
                {etablissements[etablissements.length - 1]?.siret && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    cursor="pointer"
                    onClick={() => setAddNewSiret(true)}
                    mb="10px"
                  >
                    <AddIcon boxSize="10px" color="brand.blue.700" />
                    <Text fontSize="sm" color="brand.blue.700">
                      Ajouter un SIRET
                    </Text>
                  </Stack>
                )}

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
                </FormControl>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  my="16px"
                >
                  <Button isLoading={isSubmitting}>Valider</Button>
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
            <Text color="brand.blue.700" mt="15px">
              Votre demande d'inscription a bien été prise en compte, merci de bien vouloir cliquer
              sur le lien de confirmation qui vous a été envoyé par email. <br />
              <br />
              Nous vérifierons ensuite votre demande dans les plus brefs délais.
            </Text>
          )}
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
