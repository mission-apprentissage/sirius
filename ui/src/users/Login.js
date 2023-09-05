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
  InputRightElement,
  useToast,
  FormErrorMessage,
  Link,
  Text,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import Miley from "../assets/images/miley.png";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Le champ n'est pas au bon format")
    .required("Ce champ est obligatoire"),
  password: Yup.string().required("Ce champ est obligatoire"),
});

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);

  const handleShowClick = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password }) => {
      setIsSubmitting(true);
      const result = await _post(`/api/users/login`, {
        email: email.toLowerCase(),
        password,
      });

      if (result.success) {
        toast({
          title: "Vous êtes connecté",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUserContext((oldValues) => {
          const decodedToken = jwt(result.token);

          return {
            ...oldValues,
            token: result.token,
            currentUserId: decodedToken._id,
            currentUserRole: decodedToken.role,
            currentUserStatus: decodedToken.status,
            siret: decodedToken.siret,
          };
        });
        setIsSubmitting(false);
        navigate("/campagnes/gestion");
      } else if (result.statusCode === 401) {
        toast({
          title: "Une erreur est survenue",
          description: "Mauvais email ou mot de passe",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      } else if (result.statusCode === 500) {
        toast({
          title: "Une erreur est survenue",
          description: "Merci de réessayer",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      } else if (result.statusCode === 403) {
        toast({
          title: "Une erreur est survenue",
          description: "Votre adresse email n'est pas confirmée",
          status: "error",
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
        <Heading color="purple.400">Bienvenue</Heading>
        <Box maxW="400px">
          <form onSubmit={formik.handleSubmit}>
            <Stack
              spacing={4}
              p="2rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              borderRadius="md"
            >
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
              <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300">
                    <LockIcon />
                  </InputLeftElement>
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
              <Button
                borderRadius="md"
                type="submit"
                variant="solid"
                colorScheme="purple"
                width="full"
                isLoading={isSubmitting}
              >
                Connexion
              </Button>
              <Text color="purple.300" fontSize="sm" textAlign="center">
                <Link href="/reinitialisation-mot-de-passe">Mot de passe oublié</Link>
              </Text>
              <Text color="purple.300" fontSize="sm" textAlign="center">
                <Link href="/inscription">S'inscrire en tant qu'établissement</Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
