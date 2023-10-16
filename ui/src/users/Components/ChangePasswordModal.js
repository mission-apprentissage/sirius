import React, { useState, useContext } from "react";
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
import { UserContext } from "../../context/UserContext";

import { passwordComplexityRegex, passwordComplexityMessage } from "../../utils/validators";
import InputPassword from "../../Components/Form/InputPassword";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Tous les champs doivent être complétés")
    .matches(passwordComplexityRegex, passwordComplexityMessage),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
    .required("Tous les champs doivent être complétés")
    .matches(passwordComplexityRegex, passwordComplexityMessage),
});

const ChangePasswordModal = ({ onClose, isOpen, token }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ password }) => {
      setIsSubmitting(true);
      const result = await _post(`/api/users/forgot-password`, {
        password: password,
        token: token,
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
            Nouveau mot de passe
          </Text>
          <FormError
            title="Le changement de mot de passe a échoué"
            hasError={(Object.keys(formik.errors).length || error) && formik.submitCount}
            errorMessages={errorMessages}
          />
          {isSubmitted && (
            <FormSuccess
              title="Votre mot de passe a bien été changé"
              message="Vous pouvez maintenant vous connecter avec votre nouveau mot de passe"
            />
          )}
          {!isSubmitted && (
            <form onSubmit={formik.handleSubmit}>
              <Box mb="16px">
                <InputPassword
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  formik={formik}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  mb="16px"
                  noErrorMessage
                />
              </Box>
              <InputPassword
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                formik={formik}
                showPassword={showPasswordConfirmation}
                setShowPassword={setShowPasswordConfirmation}
                noErrorMessage
              />
              <Box display="flex" alignItems="center" justifyContent="center" mt="16px">
                <Button isLoading={isSubmitting}>Valider</Button>
              </Box>
            </form>
          )}
          {isSubmitted && (
            <Box display="flex" alignItems="center" justifyContent="center" mt="16px">
              <Button>Fermer</Button>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
