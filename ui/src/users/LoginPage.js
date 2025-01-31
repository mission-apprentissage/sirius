import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useFormik } from "formik";
import jwt from "jwt-decode";
import { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import * as Yup from "yup";

import Support from "../assets/images/support.svg";
import { LoaderContainer } from "../campagnes/styles/shared.style";
import NeedHelp from "../Components/NeedHelp";
import { emailWithTLDRegex, USER_ROLES } from "../constants";
import { UserContext } from "../context/UserContext";
import useLoginUser from "../hooks/useLoginUser";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import ChangePasswordModal from "./Components/ChangePasswordModal";
import ForgottenPasswordModal from "./Components/ForgottenPasswordModal";
import { Form, StyledPasswordInput } from "./styles/login.style";
import { LoginAndSignupContainer, LoginAndSignupHeader } from "./styles/shared.style";

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

  const { loginUser, isLoading } = useLoginUser();

  const { search } = useLocation();

  const token = new URLSearchParams(search).get("token");

  const helmet = useSetAndTrackPageTitle({ title: `${token ? "Changement de mot de passe" : "Connexion"} - Sirius` });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password }) => {
      setIsSubmitting(true);
      loginUser(
        { email: email.toLocaleLowerCase(), password },
        {
          onSuccess: (result) => {
            const decodedToken = jwt(result.token);
            setUserContext(() => {
              return {
                loading: false,
                token: result.token,
                user: decodedToken.user,
              };
            });

            if (decodedToken.user.role === USER_ROLES.OBSERVER) {
              navigate("/campagnes/resultats");
            } else {
              navigate("/campagnes/gestion");
            }
          },
          onError: (error) => {
            if (error.context.statusCode === 400) {
              setError("Erreur de validation");
            } else if (error.context.statusCode === 401) {
              setError("L'adresse email ou le mot de passe est incorrect.");
            } else if (error.context.statusCode === 500) {
              setError("Merci de réessayer.");
            } else if (error.context.statusCode === 403) {
              setError("Votre adresse email n'est pas confirmée.");
            } else if (error.context.statusCode === 429) {
              setError(error.context.message);
            }
          },
        }
      );
      setIsSubmitting(false);
    },
  });

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  const errorMessages = [error].filter((value) => value !== null);

  return (
    <>
      {helmet}
      <LoginAndSignupContainer>
        <LoginAndSignupHeader>
          <div>
            <h5>Établissement</h5>
            <h2>Se connecter</h2>
          </div>
          <img src={Support} alt="" />
        </LoginAndSignupHeader>
        <Form onSubmit={formik.handleSubmit}>
          <div>
            <Input
              id="email"
              label="Email"
              type="email"
              state={formik.errors.email && formik.submitCount >= 1 ? "error" : "default"}
              stateRelatedMessage={formik.errors.email}
              nativeInputProps={{
                onChange: (e) => formik.setFieldValue("email", e.target.value),
              }}
              required
            />
            <StyledPasswordInput
              id="password"
              name="password"
              label="Mot de passe"
              state={formik.errors.password && formik.submitCount >= 1 ? "error" : "default"}
              messagesHint=""
              nativeInputProps={{
                onChange: (e) => formik.setFieldValue("password", e.target.value),
              }}
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
          <Button iconId="fr-icon-logout-box-r-line" iconPosition="right" type="submit" disabled={isSubmitting}>
            {isLoading ? (
              <LoaderContainer>
                <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
              </LoaderContainer>
            ) : (
              "Connexion"
            )}
          </Button>
        </Form>
        <p>
          Pas d'identifiant ? <Link to="/inscription">M'inscrire en tant qu'établissement</Link>
        </p>
      </LoginAndSignupContainer>
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
