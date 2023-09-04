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
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, useLocation } from "react-router-dom";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import { passwordComplexityRegex, passwordComplexityMessage } from "../utils/validators";
import Miley from "../assets/images/miley.png";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Ce champ est obligatoire")
    .matches(passwordComplexityRegex, passwordComplexityMessage),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
    .required("Ce champ est obligatoire")
    .matches(passwordComplexityRegex, passwordComplexityMessage),
});

const ResetPassword = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [userContext] = useContext(UserContext);
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleShowClickConfirmation = () => setShowPasswordConfirmation(!showPasswordConfirmation);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ password }) => {
      setIsSubmitting(true);
      const result = await _post(`/api/users/reset-password`, {
        password: password,
        token: token,
      });

      if (result.success) {
        setIsSubmitted(true);
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
          Changement de mot de passe
        </Heading>
        <Box w="500px" mt="5">
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
                  Votre mot de passe a été modifié, vous pouvez maintenant vous{" "}
                  <Link to="/connexion">connecter</Link>.
                </Text>
              ) : (
                <>
                  <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.300">
                        <LockIcon />
                      </InputLeftElement>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nouveau mot de passe"
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
                    isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
                  >
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.300">
                        <LockIcon />
                      </InputLeftElement>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswordConfirmation ? "text" : "password"}
                        placeholder="Confirmer le nouveau mot de passe"
                        onChange={formik.handleChange}
                        value={formik.values.confirmPassword}
                      />
                      <InputRightElement mr="5px">
                        <Button h="1.75rem" size="sm" onClick={handleShowClickConfirmation}>
                          {showPasswordConfirmation ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                  <Button
                    borderRadius="md"
                    type="submit"
                    variant="solid"
                    colorScheme="purple"
                    width="full"
                    isLoading={isSubmitting}
                  >
                    Modifier le mot de passe
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
