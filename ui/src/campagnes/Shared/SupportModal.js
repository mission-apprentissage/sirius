import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { apiPost } from "../../utils/api.utils";

const validationSchema = Yup.object({
  title: Yup.string().required("Tous les champs doivent être complétés."),
  message: Yup.string().required("Tous les champs doivent être complétés"),
});

const SupportModal = ({ modal, token }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSupportSubmitted, setIsSupportSubmitted] = useState(false);
  const [supportError, setSupportError] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ title, message }) => {
      setIsSubmitting(true);
      const result = await apiPost("/users/support", {
        body: {
          title,
          message,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.success) {
        setSupportError(true);
      }
      setIsSupportSubmitted(true);
      setIsSubmitting(false);
      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <modal.Component
        title={
          <>
            <span className={fr.cx("fr-icon-arrow-right-line")} />
            Un problème avec les formations affichées ?
          </>
        }
        size="small"
        buttons={
          isSupportSubmitted
            ? [
                {
                  doClosesModal: true,
                  onClick: () => formik.resetForm(),
                  children: "Fermer",
                },
              ]
            : [
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
              ]
        }
      >
        <p>
          Les formations sont extraites du Catalogue des offres de formations en apprentissage du réseau des CARIF OREF.
          Rapprochez-vous d’eux pour tout besoin de mise à jour.
        </p>
        <p>
          <b>Un problème plus urgent à signaler ? Contactez directement l’équipe Sirius</b>
        </p>
        {!isSupportSubmitted && (
          <>
            <Input
              label="Titre du problème"
              state={formik.errors.title && formik.touched.title ? "error" : "default"}
              stateRelatedMessage={formik.errors.title}
              onChange={(e) => formik.setFieldValue("title", e.target.value)}
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
          </>
        )}
        {isSupportSubmitted && (
          <Alert
            severity={supportError ? "error" : "success"}
            description={supportError ? "Une erreur s'est produite." : "Le message a été envoyé avec succès."}
          />
        )}
      </modal.Component>
    </form>
  );
};

export default SupportModal;
