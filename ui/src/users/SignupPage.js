import React, { useState, useContext } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Navigate, Link } from "react-router-dom";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import { LoginAndSignupContainer, LoginAndSignupHeader } from "./styles/shared.style";
import {
  Form,
  UserInfoContainer,
  PasswordsContainer,
  StyledPasswordInput,
  ButtonContainer,
  SuccessfulSignupHeader,
} from "./styles/signup.style";
import {
  passwordComplexityRegex,
  eightCharactersRegex,
  oneUppercase,
  oneLowercase,
  oneDigit,
  oneSpecialCharacter,
  allFieldMessage,
  notCorrespondingPasswordMessage,
  emailFormatMessage,
} from "../utils/validators";
import Support from "../assets/images/support.svg";
import { emailWithTLDRegex } from "../constants";
import AddSiret from "./Components/AddSiretDsfr/AddSiret";
import NeedHelp from "../Components/NeedHelp";
import SiriusInTheSky from "../assets/images/sirius_in_the_sky.svg";

const etablissement = Yup.object({
  siret: Yup.string().required(),
  onisep_nom: Yup.string().nullable(),
  enseigne: Yup.string().nullable(),
  entreprise_raison_sociale: Yup.string().nullable(),
});

const validationSchema = Yup.object({
  lastName: Yup.string().required(allFieldMessage),
  firstName: Yup.string().required(allFieldMessage),
  email: Yup.string().matches(emailWithTLDRegex, emailFormatMessage).required(allFieldMessage),
  password: Yup.string().required(allFieldMessage).matches(passwordComplexityRegex),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], notCorrespondingPasswordMessage)
    .required(allFieldMessage)
    .matches(passwordComplexityRegex),
  etablissements: Yup.array().of(etablissement).min(1, allFieldMessage),
  comment: Yup.string(),
});

const SignupPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);

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

  if (!userContext.loading && userContext.token) return <Navigate to="/campagnes/gestion" />;

  const hasEightCharacters = eightCharactersRegex.test(formik.values.password);
  const hasOneUppercase = oneUppercase.test(formik.values.password);
  const hasOneLowercase = oneLowercase.test(formik.values.password);
  const hasOneDigit = oneDigit.test(formik.values.password);
  const hasOneSpecialCharacter = oneSpecialCharacter.test(formik.values.password);

  const passwordMessages = [
    {
      message: "8 caractères",
      severity: hasEightCharacters ? "valid" : formik.submitCount >= 1 ? "error" : "info",
    },
    {
      message: "1 majuscule",
      severity: hasOneUppercase ? "valid" : formik.submitCount >= 1 ? "error" : "info",
    },
    {
      message: "1 minuscule",
      severity: hasOneLowercase ? "valid" : formik.submitCount >= 1 ? "error" : "info",
    },
    {
      message: "1 caractère spécial",
      severity: hasOneSpecialCharacter ? "valid" : formik.submitCount >= 1 ? "error" : "info",
    },
    {
      message: "1 chiffre",
      severity: hasOneDigit ? "valid" : formik.submitCount >= 1 ? "error" : "info",
    },
  ];

  if (formik.errors.password === allFieldMessage && formik.submitCount >= 1) {
    passwordMessages.unshift({
      message: formik.errors.password,
      severity: "error",
    });
  }

  return (
    <>
      <LoginAndSignupContainer>
        {!isSuccessful ? (
          <>
            <LoginAndSignupHeader>
              <div>
                <h5>Établissement</h5>
                <h2>S'inscrire</h2>
              </div>
              <img src={Support} alt="" />
            </LoginAndSignupHeader>
            <Form onSubmit={formik.handleSubmit}>
              <UserInfoContainer>
                <Input
                  id="lastName"
                  label="Nom"
                  state={formik.errors.lastName && formik.submitCount >= 1 ? "error" : "default"}
                  stateRelatedMessage={formik.errors.lastName}
                  onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
                />
                <Input
                  id="firstName"
                  label="Prénom"
                  state={formik.errors.firstName && formik.submitCount >= 1 ? "error" : "default"}
                  stateRelatedMessage={formik.errors.firstName}
                  onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  state={formik.errors.email && formik.submitCount >= 1 ? "error" : "default"}
                  stateRelatedMessage={formik.errors.email}
                  onChange={(e) => formik.setFieldValue("email", e.target.value)}
                />
              </UserInfoContainer>
              <PasswordsContainer>
                <StyledPasswordInput
                  label="Mot de passe"
                  state={formik.errors.password && formik.submitCount >= 1 ? "error" : "default"}
                  nativeInputProps={{
                    onChange: (e) => formik.setFieldValue("password", e.target.value),
                    id: "password",
                    name: "password",
                  }}
                  messages={passwordMessages}
                  messagesHint="Votre mot de passe doit contenir au moins:"
                />
                <StyledPasswordInput
                  label="Confirmer mot de passe"
                  nativeInputProps={{
                    onChange: (e) => formik.setFieldValue("confirmPassword", e.target.value),
                    id: "confirmPassword",
                    name: "confirmPassword",
                  }}
                  messagesHint=""
                  messages={
                    (formik.errors.confirmPassword === allFieldMessage ||
                      formik.errors.confirmPassword === notCorrespondingPasswordMessage) &&
                    formik.submitCount >= 1
                      ? [
                          {
                            message: formik.errors.confirmPassword,
                            severity: "error",
                          },
                        ]
                      : []
                  }
                />
              </PasswordsContainer>
              <AddSiret formik={formik} setError={setError} />
              <Input
                id="comment"
                label="Commentaire"
                hintText="Facultatif"
                textArea
                state={formik.errors.comment && formik.submitCount >= 1 ? "error" : "default"}
                stateRelatedMessage={formik.errors.comment}
                onChange={(e) => formik.setFieldValue("comment", e.target.value)}
              />
              {error && formik.submitCount >= 1 ? (
                <Alert severity="error" title="Une erreur s'est produite." description={error} />
              ) : null}
              <ButtonContainer>
                <Button
                  iconId="fr-icon-logout-box-r-line"
                  iconPosition="right"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Inscription
                </Button>
              </ButtonContainer>
            </Form>
            <p>
              Déjà inscrit ? <Link to="/connexion">Me connecter</Link>
            </p>
          </>
        ) : (
          <SuccessfulSignupHeader>
            <div>
              <h5>Établissement</h5>
              <h2>Inscription enregistrée !</h2>
              <p>Vous recevrez un email lorsque vous pourrez vous connecter</p>
            </div>
            <img src={SiriusInTheSky} alt="" />
          </SuccessfulSignupHeader>
        )}
      </LoginAndSignupContainer>
      <NeedHelp />
    </>
  );
};

export default SignupPage;
