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
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { _delete } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";

const DeleteCampagneConfirmationModal = ({
  onClose,
  isOpen,
  selectedCampagnes,
  setSelectedCampagnes,
  setShouldRefreshData,
}) => {
  const [userContext] = useContext(UserContext);
  const [_, setSearchParams] = useSearchParams();
  const persistedEtablissement = JSON.parse(localStorage.getItem("etablissements"));

  const handleOnClick = async () => {
    try {
      const response = await _delete(
        `/api/campagnes?ids=${selectedCampagnes}&siret=${persistedEtablissement.siret}`,
        userContext.token
      );

      if (response.acknowledged) {
        setSearchParams({ status: "successDeletion", count: selectedCampagnes.length });
        setSelectedCampagnes([]);
      }
    } catch (error) {
      setSearchParams({ status: "error" });
    }
    setShouldRefreshData(true);
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Confirmation de suppression de campagnes</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" mt="15">
          Êtes-vous sûr de vouloir supprimer{" "}
          <Text as="span" fontWeight="semibold">
            {selectedCampagnes?.length} campagne{selectedCampagnes?.length > 1 ? "s" : ""}
          </Text>{" "}
          et {selectedCampagnes?.length > 1 ? "leurs" : "ses"} témoignages associés ?
        </ModalBody>
        <ModalFooter alignItems="center" justifyContent="center" mt="15">
          <Button
            size="lg"
            variant="solid"
            bgColor="brand.blue.700"
            color="white"
            _hover={{
              bgColor: "brand.blue.700",
              color: "white",
            }}
            onClick={handleOnClick}
          >
            Confirmer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCampagneConfirmationModal;
