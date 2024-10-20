import { fr } from "@codegouvfr/react-dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { emailWithTLDRegex } from "../../constants";
import { _post } from "../../utils/httpClient";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailWithTLDRegex, "L'email n'est pas au bon format.")
    .required("Tous les champs doivent être complétés."),
});

const ForgottenPasswordModal = ({ modal, setIsForgottenPasswordSubmitted, setForgottenPasswordError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (!result.success) {
        setForgottenPasswordError(true);
      }
      setIsForgottenPasswordSubmitted(true);
      setIsSubmitting(false);
      modal.close();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <modal.Component
        title={
          <>
            <span className={fr.cx("fr-icon-arrow-right-line")} />
            Mot de passe oublié
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
        <p>
          Saisissez l’adresse électronique associée à votre compte. Nous vous enverrons plus d’informations pour
          réinitialiser votre mot de passe
        </p>
        <Input
          label="Email"
          type="email"
          state={formik.errors.email && formik.touched.email ? "error" : "default"}
          stateRelatedMessage={formik.errors.email}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          required
        />
      </modal.Component>
    </form>
  );
};

export default ForgottenPasswordModal;
