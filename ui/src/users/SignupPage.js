import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import * as Yup from "yup";

import SiriusInTheSky from "../assets/images/sirius_in_the_sky.svg";
import Support from "../assets/images/support.svg";
import NeedHelp from "../Components/NeedHelp";
import { emailWithTLDRegex, ROLE_TYPE, USER_ROLES } from "../constants";
import { UserContext } from "../context/UserContext";
import { _post } from "../utils/httpClient";
import {
  allFieldMessage,
  eightCharactersRegex,
  emailFormatMessage,
  notCorrespondingPasswordMessage,
  notCorrespondingRole,
  oneDigit,
  oneLowercase,
  oneSpecialCharacter,
  oneUppercase,
  passwordComplexityRegex,
} from "../utils/validators";
import AddSiret from "./Components/AddSiretDsfr/AddSiret";
import { LoginAndSignupContainer, LoginAndSignupHeader } from "./styles/shared.style";
import {
  ButtonContainer,
  Form,
  PasswordsContainer,
  StyledPasswordInput,
  SuccessfulSignupHeader,
  UserInfoContainer,
} from "./styles/signup.style";

const etablissement = Yup.object({
  _id: Yup.string().required(),
  siret: Yup.string().required(),
  onisep_nom: Yup.string().nullable(),
  enseigne: Yup.string().nullable(),
  entreprise_raison_sociale: Yup.string().nullable(),
});

const validationSchema = Yup.object({
  lastName: Yup.string().required(allFieldMessage),
  firstName: Yup.string().required(allFieldMessage),
  email: Yup.string().matches(emailWithTLDRegex, emailFormatMessage).required(allFieldMessage),
  role: Yup.string()
    .oneOf([USER_ROLES.ETABLISSEMENT, USER_ROLES.OBSERVER], notCorrespondingRole)
    .required(allFieldMessage),
  password: Yup.string().required(allFieldMessage).matches(passwordComplexityRegex),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], notCorrespondingPasswordMessage)
    .required(allFieldMessage)
    .matches(passwordComplexityRegex),
  etablissements: Yup.array()
    .of(etablissement)
    .when("role", {
      is: ROLE_TYPE.ETABLISSEMENT,
      then: (schema) => schema.min(1, allFieldMessage),
      otherwise: (schema) => schema.min(0).max(0),
    }),
  comment: Yup.string().when("role", {
    is: ROLE_TYPE.OBSERVER,
    then: (schema) => schema.required(allFieldMessage),
    otherwise: (schema) => schema,
  }),
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
      role: "",
      comment: "",
      email: "",
      password: "",
      etablissements: [],
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password, firstName, lastName, comment, etablissements, role }) => {
      setIsSubmitting(true);
      const etablissementsWitoutEmpty = etablissements.filter((obj) => Object.keys(obj).length !== 0);

      const resultUser = await _post(`/api/users/`, {
        firstName: firstName,
        lastName: lastName,
        role: role,
        comment: comment,
        email: email.toLowerCase(),
        password,
        etablissements: etablissementsWitoutEmpty.map((etablissement) => ({
          _id: etablissement._id,
          siret: etablissement.siret,
          onisep_nom: etablissement.onisep_nom,
          enseigne: etablissement.enseigne,
          entreprise_raison_sociale: etablissement.entreprise_raison_sociale,
        })),
      });

      if (resultUser.id) {
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
                  id="firstName"
                  label="Prénom"
                  state={formik.errors.firstName && formik.submitCount >= 1 ? "error" : "default"}
                  stateRelatedMessage={formik.errors.firstName}
                  onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
                />
                <Input
                  id="lastName"
                  label="Nom"
                  state={formik.errors.lastName && formik.submitCount >= 1 ? "error" : "default"}
                  stateRelatedMessage={formik.errors.lastName}
                  onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
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
              <RadioButtons
                orientation="horizontal"
                legend="Vous êtes ?"
                name="radio"
                options={[
                  {
                    label: "Un établissement",
                    hintText: "Votre établissement dispense des formations ou gère des établissements en dispensant",
                    nativeInputProps: {
                      value: ROLE_TYPE.ETABLISSEMENT,
                    },
                  },
                  {
                    label: "Autre",
                    hintText:
                      "Merci de préciser en commentaire le status de votre entité et les raisons de votre inscription",
                    nativeInputProps: {
                      value: ROLE_TYPE.OBSERVER,
                    },
                  },
                ]}
                onChange={(e) => formik.setFieldValue("role", e.target.value)}
                state={formik.errors.role && formik.submitCount >= 1 ? "error" : "default"}
                stateRelatedMessage={formik.errors.role}
              />
              {formik.values.role === ROLE_TYPE.ETABLISSEMENT && <AddSiret formik={formik} setError={setError} />}
              <Input
                id="comment"
                label="Commentaire"
                hintText={formik.values.role === ROLE_TYPE.OBSERVER ? "Obligatoire" : "Facultatif"}
                textArea
                state={formik.errors.comment && formik.submitCount >= 1 ? "error" : "default"}
                stateRelatedMessage={formik.errors.comment}
                onChange={(e) => formik.setFieldValue("comment", e.target.value)}
              />
              {error && formik.submitCount >= 1 ? (
                <Alert severity="error" title="Une erreur s'est produite." description={error} />
              ) : null}
              <ButtonContainer>
                <Button iconId="fr-icon-logout-box-r-line" iconPosition="right" type="submit" disabled={isSubmitting}>
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
