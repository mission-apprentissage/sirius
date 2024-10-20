import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import FormError from "../Components/Form/FormError";
import { _put } from "../utils/httpClient";

const validationSchema = Yup.object({
  acceptedCgu: Yup.boolean().required("Vous devez accepter les CGU").oneOf([true], "Vous devez accepter les CGU"),
});

const CguModal = ({ userContext, setUserContext, isOpen = true, setHasAcceptedCgu }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      acceptedCgu: false,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      try {
        setIsSubmitting(true);
        if (userContext?.token) {
          const result = await _put(`/api/users/${userContext.user.id}`, { acceptedCgu: true }, userContext.token);
          if (result === true) {
            setUserContext((oldValues) => {
              return { ...oldValues, user: { ...oldValues.user, acceptedCgu: true } };
            });
          } else {
            setError("Merci de réessayer");
          }
        } else {
          setHasAcceptedCgu(true);
        }
      } catch (error) {
        setError("Merci de réessayer");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const errorMessages = [...new Set(Object.values(formik.errors)), error];

  return (
    <Modal isOpen={isOpen} size="sm" isCentered autoFocus={false}>
      <ModalOverlay />
      <ModalContent py="8" px="4" bgColor="brand.blue.100" width="90%" borderRadius="20px">
        <ModalHeader textAlign="center" color="brand.blue.700">
          <Text fontWeight="600" fontSize="md">
            Conditions Générales d’Utilisation Sirius
          </Text>
        </ModalHeader>
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <FormError
              title="La validation des CGU a échouée"
              hasError={(Object.keys(formik.errors).length || error) && formik.submitCount}
              errorMessages={errorMessages}
            />
            <Stack textAlign="center">
              <Text color="brand.black.500">
                Les conditions générales d’utilisation (dites « CGU ») fixent le cadre juridique de “Sirius” et
                définissent les conditions d’accès et d’utilisation du service par ses utilisateurs.
              </Text>
              <Text color="brand.blue.700" textDecoration="underline" mt="25px">
                <Link href="/cgu" target="_blank">
                  <ArrowForwardIcon /> Pour en savoir plus, visitez la page CGU de Sirius en suivant ce lien
                </Link>
              </Text>
              <Box>
                <Checkbox
                  id="acceptedCgu"
                  name="acceptedCgu"
                  formik={formik}
                  onChange={(e) => formik.setFieldValue("acceptedCgu", e.target.checked)}
                  colorScheme="brand.blue"
                  size="lg"
                  mt="25px"
                  _checked={{
                    "& .chakra-checkbox__control": { backgroundColor: "brand.blue.700" },
                  }}
                  borderColor="brand.blue.400"
                >
                  <Text color="brand.black.500" fontSize="md">
                    Je déclare avoir pris connaissance des CGU de Sirius et je les accepte
                  </Text>
                </Checkbox>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center" alignItems="center">
            <Button
              size="lg"
              variant="solid"
              rightIcon={<ArrowForwardIcon />}
              isLoading={isSubmitting}
              bgColor="brand.blue.700"
              color="white"
              colorScheme="brand.blue"
              type="submit"
            >
              Suivant
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CguModal;
