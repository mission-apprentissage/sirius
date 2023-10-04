import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { _post } from "../../utils/httpClient";
import InputText from "../../Components/Form/InputText";
import Button from "../../Components/Form/Button";
import FormError from "../../Components/Form/FormError";
import FormSuccess from "../../Components/Form/FormSuccess";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("L'email n'est pas au bon format")
    .required("Tous les champs doivent être complétés"),
});

const ForgottenPasswordModal = ({ onClose, isOpen }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

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

      if (result.success) {
        setIsSubmitted(true);
        setIsSubmitting(false);
      } else if (result.statusCode === 429) {
        setError(result.message);
        setIsSubmitting(false);
      } else {
        setError("Merci de réessayer");
        setIsSubmitting(false);
      }
    },
  });
  const errorMessages = [...new Set(Object.values(formik.errors)), error];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bgColor="brand.blue.100">
        <ModalCloseButton />
        <ModalBody p="82px">
          <Text fontSize="3xl" fontWeight="600" color="brand.blue.700" mb="16px">
            Mot de passe oublié ?
          </Text>
          <Text mb="16px">
            Saisissez l’adresse électronique associée à votre compte. Nous vous enverrons plus
            d’informations pour réinitialiser votre mot de passe.
          </Text>
          <FormError
            title="La réinitilisation du mot de passe a échouée"
            hasError={(Object.keys(formik.errors).length || error) && formik.submitCount}
            errorMessages={errorMessages}
          />
          {isSubmitted && (
            <FormSuccess
              message={`Un email vous a été envoyé à l'adresse ${formik.values.email}`}
            />
          )}
          <form onSubmit={formik.handleSubmit}>
            <InputText
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              noErrorMessage
              mb="16px"
              formik={formik}
            />
            <Box display="flex" alignItems="center" justifyContent="center" mt="16px">
              <Button isLoading={isSubmitting}>Valider</Button>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ForgottenPasswordModal;
