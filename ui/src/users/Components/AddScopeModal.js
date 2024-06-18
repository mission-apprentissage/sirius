import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  useToast,
  Stack,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useFormik } from "formik";
import { _put } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";
import { OBSERVER_SCOPES, OBSERVER_SCOPES_LABELS } from "../../constants";

const scopesOptions = Object.entries(OBSERVER_SCOPES_LABELS).map(([value, label]) => ({
  label,
  value,
}));

const AddScopeModal = ({ user, onClose, isOpen, setRefetchData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scopeField, setScopeField] = useState(undefined);
  const [scopeValue, setScopeValue] = useState(undefined);
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  useEffect(() => {
    if (user && user.scope) {
      setScopeField(user.scope.field);
      setScopeValue(user.scope.value);
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      scope: [],
    },
    onSubmit: async () => {
      setIsSubmitting(true);
      if (!scopeField || (!scopeValue && scopeField !== OBSERVER_SCOPES.NATIONAL)) {
        setIsSubmitting(false);
        return;
      }
      const resultUser = await _put(
        `/api/users/${user._id}`,
        {
          scope: { field: scopeField, value: scopeValue },
        },
        userContext.token
      );

      if (resultUser.modifiedCount === 1) {
        toast({
          title: "Scope ajouté",
          description: "Les nouveaux scopes ont bien été ajouté.",
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Une erreur est survenue",
          status: "error",
          duration: 5000,
        });
      }

      setIsSubmitting(false);
      setRefetchData(true);
      setScopeField(undefined);
      setScopeValue(undefined);
      onClose();
      formik.resetForm();
    },
  });

  if (!user) return null;

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader textAlign="center">Ajout de scope</ModalHeader>
          <ModalCloseButton />
          <ModalBody mt="15">
            <Text fontSize="sm" mb="15px" textAlign="left">
              Ces scopes seront ajoutés à l'utilisateur :{" "}
              <Text as="span" fontWeight="semibold">
                {user.firstName} {user.lastName}
              </Text>
            </Text>
            <Stack mt="16px" direction={scopeField === OBSERVER_SCOPES.SIRETS ? "column" : "row"}>
              <Select
                options={scopesOptions}
                placeholder="Scopes"
                size="md"
                w="50%"
                chakraStyles={{
                  placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: "brand.black.500",
                  }),
                  container: (baseStyles) => ({
                    ...baseStyles,
                    width: "50%",
                    borderColor: "brand.blue.400",
                  }),
                  multiValue: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: "brand.blue.500",
                    color: "white",
                  }),
                }}
                isClearable={false}
                value={scopesOptions.find((option) => option.value === scopeField)}
                onChange={(e) => setScopeField(e.value)}
              />
              {scopeField === OBSERVER_SCOPES.SIRETS ? (
                <Textarea
                  onChange={(e) =>
                    setScopeValue(
                      e.target.value ? e.target.value.split(",").map((siret) => siret.trim()) : null
                    )
                  }
                  placeholder="Liste de SIRET, séparés par des virgules"
                  mt="10px"
                  color="brand.black.500"
                  _placeholder={{ color: "brand.black.500" }}
                  spellCheck
                  value={scopeValue}
                />
              ) : (
                scopeField !== OBSERVER_SCOPES.NATIONAL && (
                  <Input
                    name="value"
                    placeholder="Valeur"
                    value={scopeValue}
                    w="50%"
                    onChange={(e) => setScopeValue(e.target.value ? e.target.value : null)}
                  />
                )
              )}
            </Stack>
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="center" mt="15">
            <Button
              size="lg"
              variant="solid"
              colorScheme="brand.blue"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!scopeField || (!scopeValue && scopeField !== OBSERVER_SCOPES.NATIONAL)}
            >
              Ajouter
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddScopeModal;
