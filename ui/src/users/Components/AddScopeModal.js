import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";

import { OBSERVER_SCOPES, OBSERVER_SCOPES_LABELS } from "../../constants";
import { UserContext } from "../../context/UserContext";
import { REGIONS } from "../../regions";
import { apiPut } from "../../utils/api.utils";

const scopesOptions = Object.entries(OBSERVER_SCOPES_LABELS).map(([value, label]) => ({
  label,
  value,
}));

const regionsOptions = REGIONS.map((region) => ({
  label: region.nom,
  value: region.nom,
})).sort((a, b) => a.label.localeCompare(b.label));

const departementsOptions = REGIONS.flatMap((region) =>
  region.departements.map((departement) => ({
    label: departement.nom,
    value: departement.code,
  }))
).sort((a, b) => a.label.localeCompare(b.label));

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
      const resultUser = await apiPut(`/api/users/:id`, {
        params: { id: user.id },
        body: {
          scope: { field: scopeField, value: scopeValue },
        },
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      if (resultUser === true) {
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
              {scopeField === OBSERVER_SCOPES.SIRETS && (
                <Textarea
                  onChange={(e) =>
                    setScopeValue(e.target.value ? e.target.value.split(",").map((siret) => siret.trim()) : null)
                  }
                  placeholder="Liste de SIRET, séparés par des virgules"
                  mt="10px"
                  color="brand.black.500"
                  _placeholder={{ color: "brand.black.500" }}
                  spellCheck
                  value={scopeValue}
                />
              )}
              {(scopeField === OBSERVER_SCOPES.REGION || scopeField === OBSERVER_SCOPES.NUM_DEPARTEMENT) && (
                <Select
                  size="md"
                  onChange={(e) => setScopeValue(e.value)}
                  options={scopeField === OBSERVER_SCOPES.REGION ? regionsOptions : departementsOptions}
                  placeholder="Valeur"
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
                  defaultValue={
                    scopeField === OBSERVER_SCOPES.REGION
                      ? { label: scopeValue, value: scopeValue }
                      : departementsOptions.find((dep) => dep.value === scopeValue)
                  }
                />
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
