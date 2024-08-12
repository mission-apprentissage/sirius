import React, { useContext } from "react";
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
} from "@chakra-ui/react";
import { _put, _post, _get } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";
import { USER_ROLES } from "../../constants";

const ChangeUserStatusConfirmationModal = ({
  user,
  onClose,
  isOpen,
  selectedStatus,
  setRefetchData,
}) => {
  const [userContext] = useContext(UserContext);
  const toast = useToast();

  if (!user) return null;

  const handleChangeStatusConfirmation = async () => {
    const isEtablissment = user.role === USER_ROLES.ETABLISSEMENT;

    if (isEtablissment) {
      const getRemoteEtablissementsToCreate = async () => {
        const etablissementsSiret = user.etablissements.map((etablissement) => etablissement.siret);

        const result = await _get(
          `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={"siret": {"$in": ${JSON.stringify(
            etablissementsSiret
          )}}}&page=1&limit=100`
        );
        return result.etablissements;
      };

      const remoteEtablissementsToCreate = await getRemoteEtablissementsToCreate();

      const createLocalEtablissements = async () => {
        const payload = remoteEtablissementsToCreate.map((etablissement) => {
          return {
            data: etablissement,
            createdBy: user.id,
          };
        });

        const result = await _post(`/api/etablissements/`, payload, userContext.token);

        return result;
      };

      const localEtablissementsCreatedResult = await createLocalEtablissements();

      const userResult = await _put(
        `/api/users/${user.id}`,
        { status: selectedStatus },
        userContext.token
      );

      if (userResult.modifiedCount === 1) {
        toast({
          title: "Status modifié",
          description: `Le status a bien été modifié, ${localEtablissementsCreatedResult.length} nouveau(x) établissement(s) ont été créé(s)`,
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
    } else {
      const userResult = await _put(
        `/api/users/${user.id}`,
        { status: selectedStatus },
        userContext.token
      );
      if (userResult.modifiedCount === 1) {
        toast({
          title: "Status modifié",
          description: `Le status a bien été modifié.`,
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
    }

    setRefetchData(true);
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de changement de status</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Le status de
          <Text fontWeight="semibold">
            {user.firstName} {user.lastName}
          </Text>
          sera modifié de{" "}
          <Text as="span" fontWeight="semibold">
            {user.status}
          </Text>{" "}
          à{" "}
          <Text as="span" fontWeight="semibold">
            {selectedStatus}
          </Text>
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button
            size="lg"
            variant="solid"
            colorScheme="brand.blue"
            onClick={handleChangeStatusConfirmation}
          >
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUserStatusConfirmationModal;
