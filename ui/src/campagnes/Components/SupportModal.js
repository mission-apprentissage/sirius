import React, { useState } from "react";
import {
  Text,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  FormControl,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { _post } from "../../utils/httpClient";
import Button from "../../Components/Form/Button";
import FormSuccess from "../../Components/Form/FormSuccess";
import FormError from "../../Components/Form/FormError";
import InputText from "../../Components/Form/InputText";

const validationSchema = Yup.object({
  title: Yup.string().required("Tous les champs doivent être complétés"),
  message: Yup.string().required("Tous les champs doivent être complétés"),
});

const SupportModal = ({ isOpen, onClose, token }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: async ({ title, message }) => {
      setIsSubmitting(true);
      const result = await _post(
        `/api/users/support`,
        {
          title,
          message,
        },
        token
      );
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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        formik.resetForm();
        setError(null);
        setIsSubmitted(false);
      }}
      size="xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent p="42px" bgColor="brand.blue.100" width="100%" borderRadius="20px">
        <ModalCloseButton />
        <ModalHeader color="brand.blue.700">
          <Text fontWeight="600" fontSize="30px" mb="16px">
            Un problème avec les formations affichées ?
          </Text>
          <Text fontWeight="400" fontSize="16px" color="brand.black.500">
            Les formations sont extraites du Catalogue des offres de formations en apprentissage du
            réseau des CARIF OREF. Rapprochez-vous d’eux pour tout besoin de mise à jour.
          </Text>
          <Text fontSize="16px" fontWeight="600" color="brand.black.500" mt="15px">
            Un problème plus urgent à signaler ? Contactez directement l’équipe Sirius
          </Text>
        </ModalHeader>
        <ModalBody>
          <FormError
            title="L'envoi du message a échoué"
            hasError={(Object.keys(formik.errors).length || error) && formik.submitCount}
            errorMessages={errorMessages}
          />
          {isSubmitted && (
            <FormSuccess
              title="Votre message nous a bien été transmis"
              message="Nous vous répondrons par email dans les plus brefs délais"
            />
          )}
          {!isSubmitted && (
            <form onSubmit={formik.handleSubmit}>
              <Stack direction="column" alignItems="center" justifyContent="center" mt="0" w="100%">
                <InputText
                  id="title"
                  name="title"
                  placeholder="Titre du problème"
                  formik={formik}
                  noErrorMessage
                />
                <FormControl isInvalid={!!formik.errors.message && formik.touched.message}>
                  <Textarea
                    id="message"
                    name="message"
                    type="text"
                    placeholder="Détails"
                    onChange={formik.handleChange}
                    value={formik.values.message}
                    size="lg"
                    color="brand.black.500"
                    _placeholder={{ color: "brand.black.500" }}
                    borderColor="brand.blue.400"
                  />
                </FormControl>
                <Button isLoading={isSubmitting} mt="16px">
                  Envoyer
                </Button>
              </Stack>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupportModal;
