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
import { USER_STATUS } from "../../constants";

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
    const isActivatingUser =
      selectedStatus === USER_STATUS.ACTIVE &&
      (user.status === USER_STATUS.INACTIVE || user.status === USER_STATUS.PENDING);

    let existingEtablissements = [];

    user.etablissements.forEach(async (etablissement) => {
      const result = await _get(
        `/api/etablissements?data.siret=${etablissement.siret}`,
        userContext.token
      );
      existingEtablissements.push(result[0]);
    });

    const isExistingEtablissements = existingEtablissements.length > 0;

    const filteredEtablissementsToCreate = user.etablissements.filter(
      (etablissement) =>
        !existingEtablissements.find((existingEtablissement) => {
          return existingEtablissement.siret === etablissement.siret;
        })
    );

    const getRemoteEtablissementsToCreate = async () => {
      const remoteEtablissementsToCreate = [];

      for (const etablissement of filteredEtablissementsToCreate) {
        const result = await _get(
          `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${etablissement.siret}"}&page=1&limit=1`
        );

        if (result.etablissements?.length > 0) {
          remoteEtablissementsToCreate.push(result.etablissements[0]);
        }
      }

      return remoteEtablissementsToCreate;
    };

    const remoteEtablissementsToCreate = await getRemoteEtablissementsToCreate();

    const createLocalEtablissements = async () => {
      const localEtablissementsCreated = [];

      for (const etablissement of remoteEtablissementsToCreate) {
        const result = await _post(
          `/api/etablissements/`,
          {
            data: etablissement,
            createdBy: user._id,
          },
          userContext.token
        );

        localEtablissementsCreated.push(result);
      }

      return localEtablissementsCreated;
    };

    const localEtablissementsCreatedResult = await createLocalEtablissements();

    const userResult = await _put(
      `/api/users/${user._id}`,
      { status: selectedStatus },
      userContext.token
    );

    const isEtablissementCreationSuccess = localEtablissementsCreatedResult.every(
      (result) => result._id
    );

    if (
      userResult.modifiedCount === 1 &&
      ((isActivatingUser && (isEtablissementCreationSuccess || isExistingEtablissements)) ||
        !isActivatingUser)
    ) {
      toast({
        title: "Status modifié",
        description: "Le status a bien été modifié",
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
