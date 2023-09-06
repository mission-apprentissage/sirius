import React, { useState, useContext } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  Avatar,
  FormControl,
  useToast,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate } from "react-router-dom";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import Miley from "../assets/images/miley.png";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Le champ n'est pas au bon format")
    .required("Ce champ est obligatoire"),
});

const ResetPassword = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userContext] = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email }) => {
      setIsSubmitting(true);
      const result = await _post(`/api/users/forgot-password`, {
        email: email.toLowerCase(),
      });

      if (result.success) {
        setIsSubmitted(true);
        setIsSubmitting(false);
      } else if (result.statusCode === 429) {
        toast({
          title: "Une erreur est survenue",
          description: result.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      } else {
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

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" w="100%">
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar size="lg" src={Miley} alt="" />
        <Heading color="purple.400" mt="5">
          Demande de réinitialisation de mot de passe
        </Heading>
        <Text color="purple.400" mt="5">
          Si votre adresse email existe, un email vous sera envoyé avec un lien pour réinitialiser
          votre mot de passe.
        </Text>
        <Box maxW="400px" mt="5">
          <form onSubmit={formik.handleSubmit}>
            <Stack
              spacing={4}
              p="2rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              borderRadius="md"
            >
              {isSubmitted ? (
                <Text align="center" color="purple.500">
                  Un email avec un lien de réinitialisation vous a été envoyé.
                </Text>
              ) : (
                <>
                  <FormControl isInvalid={!!formik.errors.email && formik.touched.email}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.300">
                        <EmailIcon />
                      </InputLeftElement>
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Adresse email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                      />
                    </InputGroup>
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
                  <Button
                    borderRadius="md"
                    type="submit"
                    variant="solid"
                    colorScheme="purple"
                    width="full"
                    isLoading={isSubmitting}
                  >
                    Envoyer la demande
                  </Button>
                </>
              )}
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default ResetPassword;
