import React, { useState, useContext } from "react";
import {
  Flex,
  Stack,
  Box,
  Link,
  Text,
  Image,
  useBreakpoint,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import jwt from "jwt-decode";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import UnderConstruction from "../assets/images/under_construction.svg";
import InputPassword from "../Components/Form/InputPassword";
import InputText from "../Components/Form/InputText";
import Button from "../Components/Form/Button";
import ForgottenPasswordModal from "./Components/ForgottenPasswordModal";
import ChangePasswordModal from "./Components/ChangePasswordModal";
import FormError from "../Components/Form/FormError";
import { emailWithTLDRegex } from "../constants";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailWithTLDRegex, "L'email n'est pas au bon format")
    .required("Tous les champs doivent être complétés"),
  password: Yup.string().required("Tous les champs doivent être complétés"),
});

const Login = () => {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint({ ssr: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userContext, setUserContext] = useContext(UserContext);
  const {
    isOpen: isOpenForgottenPassword,
    onOpen: onOpenForgottenPassword,
    onClose: onCloseForgottenPassword,
  } = useDisclosure();

  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");

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
        const decodedToken = jwt(result.token);

        setUserContext((oldValues) => {
          return {
            ...oldValues,
            token: result.token,
            loading: false,
            currentUserId: decodedToken._id,
            currentUserRole: decodedToken.role,
            currentUserStatus: decodedToken.status,
            siret: decodedToken.siret,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            email: decodedToken.email,
            etablissementLabel: decodedToken.etablissementLabel,
            etablissements: decodedToken.etablissements,
          };
        });
        const siret = decodedToken.siret || decodedToken.etablissements[0].siret;
        setIsSubmitting(false);
        navigate({ pathname: "/campagnes/gestion", search: `?etablissement=${siret}` });
      } else if (result.statusCode === 400) {
        setError("Erreur de validation");
        setIsSubmitting(false);
      } else if (result.statusCode === 401) {
        setError("Mauvais email ou mot de passe");
        setIsSubmitting(false);
      } else if (result.statusCode === 500) {
        setError("Merci de réessayer");
        setIsSubmitting(false);
      } else if (result.statusCode === 403) {
        setError("Votre adresse email n'est pas confirmée");
        setIsSubmitting(false);
      } else if (result.statusCode === 429) {
        setError(result.message);
        setIsSubmitting(false);
      }
    },
  });

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  const errorMessages = [...new Set(Object.values(formik.errors)), error];

  return (
    <>
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
                <FormError
                  title="La connexion a échouée"
                  hasError={(Object.keys(formik.errors).length || error) && formik.submitCount}
                  errorMessages={errorMessages}
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
                <Text
                  color="brand.blue.700"
                  fontSize="sm"
                  textDecoration="underline"
                  onClick={onOpenForgottenPassword}
                  cursor="pointer"
                >
                  Mot de passe oublié ?
                </Text>
                <ForgottenPasswordModal
                  isOpen={isOpenForgottenPassword}
                  onClose={onCloseForgottenPassword}
                />
                <Box display="flex" alignItems="center" justifyContent="center" mt="16px">
                  <Button isLoading={isSubmitting}>Connexion</Button>
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
      <ChangePasswordModal token={token} isOpen={!!token} />
    </>
  );
};

export default Login;
