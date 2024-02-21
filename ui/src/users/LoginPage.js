import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, useNavigate, useLocation, Link } from "react-router-dom";
import jwt from "jwt-decode";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import { Container, Header, Form, StyledPasswordInput } from "./Components/login.style";
import Support from "../assets/images/support.svg";
import ForgottenPasswordModal from "./Components/ForgottenPasswordModal";
import ChangePasswordModal from "./Components/ChangePasswordModal";
import { USER_ROLES, emailWithTLDRegex } from "../constants";
import { etablissementLabelGetter } from "../utils/etablissement";
import NeedHelp from "../Components/NeedHelp";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailWithTLDRegex, "L'email n'est pas au bon format.")
    .required("Tous les champs doivent être complétés."),
  password: Yup.string().required("Tous les champs doivent être complétés."),
});

const forgottenPasswordModal = createModal({
  id: "forgotten-password-modal",
  isOpenedByDefault: false,
});

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgottenPasswordSubmitted, setIsForgottenPasswordSubmitted] = useState(false);
  const [forgottenPasswordError, setForgottenPasswordError] = useState(false);
  const [isChangePasswordSubmitted, setIsChangePasswordSubmitted] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(false);
  const [error, setError] = useState(null);
  const [userContext, setUserContext] = useContext(UserContext);

  const { search } = useLocation();

  const token = new URLSearchParams(search).get("token");

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
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            email: decodedToken.email,
            siret: decodedToken.siret,
            acceptedCgu: decodedToken.acceptedCgu || false,
            etablissements: decodedToken.etablissements || [],
          };
        });
        if (decodedToken.role === USER_ROLES.ETABLISSEMENT) {
          localStorage.setItem(
            "etablissements",
            JSON.stringify({
              siret: decodedToken.siret || decodedToken.etablissements[0].siret,
              etablissementLabel:
                decodedToken.etablissementLabel ||
                etablissementLabelGetter(decodedToken.etablissements[0]),
              etablissements: decodedToken.etablissements || [],
            })
          );
        }

        navigate("/campagnes/gestion");
      } else if (result.statusCode === 400) {
        setError("Erreur de validation");
      } else if (result.statusCode === 401) {
        setError("L'adresse email ou le mot de passe est incorrect.");
      } else if (result.statusCode === 500) {
        setError("Merci de réessayer.");
      } else if (result.statusCode === 403) {
        setError("Votre adresse email n'est pas confirmée.");
      } else if (result.statusCode === 429) {
        setError(result.message);
      }
      setIsSubmitting(false);
    },
  });

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  const errorMessages = [error].filter((value) => value !== null);

  return (
    <>
      <Container>
        <Header>
          <div>
            <h5>Établissement</h5>
            <h2>Se connecter</h2>
          </div>
          <img src={Support} alt="" />
        </Header>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <Input
              id="email"
              label="Email"
              type="email"
              state={formik.errors.email && formik.submitCount >= 1 ? "error" : "default"}
              stateRelatedMessage={formik.errors.email}
              onChange={(e) => formik.setFieldValue("email", e.target.value)}
              required
            />
            <StyledPasswordInput
              id="password"
              name="password"
              label="Mot de passe"
              state={formik.errors.password && formik.submitCount >= 1 ? "error" : "default"}
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
              messagesHint=""
              messages={
                formik.errors.password && formik.submitCount >= 1
                  ? [
                      {
                        message: formik.errors.password,
                        severity: "error",
                      },
                    ]
                  : []
              }
            />
          </div>
          <p
            onClick={(event) => {
              event.preventDefault();
              forgottenPasswordModal.open();
            }}
          >
            Mot de passe oublié ?
          </p>
          {errorMessages.length && formik.submitCount >= 1 ? (
            <Alert severity="error" title={"Une erreur s'est produite."} description={error} />
          ) : null}
          {isForgottenPasswordSubmitted ? (
            <Alert
              severity={forgottenPasswordError ? "error" : "success"}
              title={
                forgottenPasswordError
                  ? "Une erreur s'est produite lors de la réinitialisation de votre mot de passe."
                  : "Un email de réinitialisation de mot de passe vous a été envoyé."
              }
            />
          ) : null}
          {isChangePasswordSubmitted ? (
            <Alert
              severity={changePasswordError ? "error" : "success"}
              title={
                changePasswordError
                  ? "Une erreur s'est produite lors de la réinitialisation de votre mot de passe."
                  : "Votre mot de passe a été réinitialisé avec succès. Connectez-vous avec votre nouveau mot de passe."
              }
            />
          ) : null}
          <Button
            iconId="fr-icon-logout-box-r-line"
            iconPosition="right"
            type="submit"
            disabled={isSubmitting}
          >
            Connexion
          </Button>
        </Form>
        <p>
          Pas d'identifiant ? <Link to="/inscription">M'inscrire en tant qu'établissement</Link>
        </p>
      </Container>
      <NeedHelp />
      <ForgottenPasswordModal
        modal={forgottenPasswordModal}
        setIsForgottenPasswordSubmitted={setIsForgottenPasswordSubmitted}
        setForgottenPasswordError={setForgottenPasswordError}
      />
      {token && (
        <ChangePasswordModal
          token={token}
          setIsChangePasswordSubmitted={setIsChangePasswordSubmitted}
          setChangePasswordError={setChangePasswordError}
        />
      )}
    </>
  );
};

export default LoginPage;
