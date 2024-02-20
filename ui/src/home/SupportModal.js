import React, { useState } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import * as Yup from "yup";
import { useFormik } from "formik";
import { fr } from "@codegouvfr/react-dsfr";
import { _post } from "../utils/httpClient";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Votre email n'est pas valide")
    .required("Tous les champs doivent être complétés"),
  message: Yup.string().required("Tous les champs doivent être complétés"),
});

const SupportModal = ({ modal, setIsSupportSubmitted, setSupportError }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ email, message }) => {
      setIsSubmitting(true);
      const result = await _post(`/api/users/support/public`, {
        email,
        message,
      });
      if (!result.success) {
        setSupportError(true);
      }
      setIsSupportSubmitted(true);
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
            Échangez par email avec un membre de notre équipe
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
          Saisissez l’adresse électronique associée à votre compte puis votre message. Nous vous
          répondrons.
        </p>
        <Input
          label="Email"
          type="email"
          state={formik.errors.email && formik.touched.email ? "error" : "default"}
          stateRelatedMessage={formik.errors.email}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          required
        />
        <Input
          label="Message"
          state={formik.errors.message && formik.touched.message ? "error" : "default"}
          stateRelatedMessage={formik.errors.message}
          textArea={true}
          onChange={(e) => formik.setFieldValue("message", e.target.value)}
          required
        />
      </modal.Component>
    </form>
  );
};

export default SupportModal;
