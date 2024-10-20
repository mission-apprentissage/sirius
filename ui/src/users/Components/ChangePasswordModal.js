import { fr } from "@codegouvfr/react-dsfr";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import styled from "@emotion/styled";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { apiPost } from "../../utils/api.utils";
import {
  allFieldMessage,
  eightCharactersRegex,
  notCorrespondingPasswordMessage,
  oneDigit,
  oneLowercase,
  oneSpecialCharacter,
  oneUppercase,
  passwordComplexityRegex,
} from "../../utils/validators";

const StyledPasswordInput = styled(PasswordInput)`
  margin-bottom: ${fr.spacing("4w")};
`;

const validationSchema = Yup.object({
  password: Yup.string().required(allFieldMessage).matches(passwordComplexityRegex, null),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], notCorrespondingPasswordMessage)
    .required(allFieldMessage)
    .matches(passwordComplexityRegex),
});

const modal = createModal({
  id: "change-password-modal",
  isOpenedByDefault: true,
});

const ChangePasswordModal = ({ token, setIsChangePasswordSubmitted, setChangePasswordError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ password }) => {
      setIsSubmitting(true);
      const result = await apiPost("/users/reset-password", {
        body: { password: password, token: token },
      });
      if (!result.success) {
        setChangePasswordError(true);
      }
      setIsChangePasswordSubmitted(true);
      setIsSubmitting(false);
      modal.close();
    },
  });

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
    <form onSubmit={formik.handleSubmit}>
      <modal.Component
        title={
          <>
            <span className={fr.cx("fr-icon-arrow-right-line")} />
            Nouveau mot de passe
          </>
        }
        size="small"
        buttons={[
          {
            doClosesModal: true,
            children: "Annuler",
          },
          {
            doClosesModal: false,
            children: "Envoyer",
            type: "submit",
            disabled: isSubmitting,
          },
        ]}
      >
        <StyledPasswordInput
          label="Mot de passe"
          state="error"
          nativeInputProps={{
            onChange: (e) => formik.setFieldValue("password", e.target.value),
            id: "password",
            name: "password",
          }}
          messagesHint="Votre mot de passe doit contenir au moins:"
          messages={passwordMessages}
        />
        <PasswordInput
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
      </modal.Component>
    </form>
  );
};

export default ChangePasswordModal;
