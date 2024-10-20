import { fr } from "@codegouvfr/react-dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { emailWithTLDRegex } from "../constants";
import { apiPost } from "../utils/api.utils";

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailWithTLDRegex, "L'email n'est pas au bon format.")
    .required("Tous les champs doivent être complétés."),
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

      const result = await apiPost("/users/support/public", {
        body: {
          email,
          message,
        },
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
        <p>Saisissez l’adresse électronique associée à votre compte puis votre message. Nous vous répondrons.</p>
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
