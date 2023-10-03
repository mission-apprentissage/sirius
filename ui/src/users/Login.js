import React, { useState, useContext } from "react";
import {
  Flex,
  Button,
  Stack,
  Box,
  useToast,
  Link,
  Text,
  Image,
  useBreakpoint,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate } from "react-router-dom";
import jwt from "jwt-decode";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import UnderConstruction from "../assets/images/under_construction.svg";
import InputPassword from "./Components/InputPassword";
import InputText from "./Components/InputText";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Le champ n'est pas au bon format")
    .required("Ce champ est obligatoire"),
  password: Yup.string().required("Ce champ est obligatoire"),
});

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const breakpoint = useBreakpoint({ ssr: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const isMobile = breakpoint === "base";

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
      } else if (result.statusCode === 429) {
        toast({
          title: "Une erreur est survenue",
          description: result.message,
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
        <Image src={UnderConstruction} alt="" />
        <Box w={isMobile ? "100%" : "400px"} mt={isMobile ? "32px" : "64px"}>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <Text color="brand.blue.700" fontSize="xl" my="0">
                Établissement
              </Text>
              <Text color="brand.blue.700" fontSize="3xl" fontWeight="600" my="0">
                Se connecter
              </Text>
              <InputText id="email" name="email" type="email" placeholder="Email" formik={formik} />
              <InputPassword id="password" name="password" formik={formik} />
              <Text color="brand.blue.700" fontSize="sm" textDecoration="underline">
                <Link href="/reinitialisation-mot-de-passe">Mot de passe oublié ?</Link>
              </Text>
              <Box display="flex" alignItems="center" justifyContent="center" mt="16px">
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
                  Connexion
                </Button>
              </Box>
              <Text
                color="brand.blue.700"
                fontSize="sm"
                textAlign="center"
                mt={isMobile ? "32px" : "64px"}
              >
                Pas d'identifiant ? {isMobile ? <br /> : null}
                <Link href="/inscription" textDecoration="underline">
                  M'inscrire en tant qu'établissement
                </Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
