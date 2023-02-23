import React, { useState, useEffect } from "react";
import {
  Center,
  IconButton,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableCaption,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  VStack,
  Link,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ViewIcon, LinkIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import QRCode from "react-qr-code";

import { _delete } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";
import Breadcrumbs from "../Components/Breadcrumbs";

const ViewCampagnes = ({ crumbs }) => {
  const [deletedCampagneId, setDeletedCampagneId] = useState(null);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [campagneLinks, setCampagneLinks] = useState(null);
  const history = useHistory();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [campagnes, loading, error] = useGet(`/api/campagnes/`);

  useEffect(() => {
    if (campagnes) {
      setDisplayedCampagnes(campagnes);
    }
  }, [campagnes]);

  useEffect(() => {
    const deleteCampagne = async () => {
      const result = await _delete(`/api/campagnes/${deletedCampagneId}`);

      if (result?.message === "ok") {
        toast({
          title: "Campagne supprimée",
          description: "La campagne a bien été supprimée",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Une erreur est survenue",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      const filteredDisplayedCampagne = displayedCampagnes.filter((campagne) => campagne._id !== deletedCampagneId);
      setDisplayedCampagnes(filteredDisplayedCampagne);
    };
    if (deletedCampagneId) {
      deleteCampagne();
    }
  }, [deletedCampagneId]);

  if (loading || error) return <Spinner size="xl" />;
  return (
    <>
      {crumbs && <Breadcrumbs crumbs={crumbs} />}
      <Flex bg="gray.100" align="center" justify="center" minH="100vh">
        <TableContainer my={12}>
          <Table colorScheme="purple" size="md">
            <TableCaption>
              <Center>
                <IconButton
                  aria-label="Ajouter une campagne"
                  variant="outline"
                  colorScheme="purple"
                  icon={<AddIcon />}
                  onClick={() => history.push(`/campagnes/ajout`)}
                />
              </Center>
            </TableCaption>

            <Thead>
              <Tr>
                <Th>Nom de la campagne</Th>
                <Th>CFA</Th>
                <Th>Formation</Th>
                <Th>Début</Th>
                <Th>Fin</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedCampagnes.map((campagne) => (
                <Tr key={campagne._id}>
                  <Td>{campagne.nomCampagne}</Td>
                  <Td>{campagne.cfa}</Td>
                  <Td>{campagne.formation}</Td>
                  <Td>{campagne.startDate}</Td>
                  <Td>{campagne.endDate}</Td>
                  <Td>
                    <IconButton
                      aria-label="Voir la campagne"
                      variant="outline"
                      colorScheme="purple"
                      icon={<ViewIcon />}
                      onClick={() => history.push(`/campagnes/${campagne._id}`)}
                      mx={2}
                    />
                    <IconButton
                      aria-label="Voir le lien et le QR code de la campagne"
                      variant="outline"
                      colorScheme="purple"
                      icon={<LinkIcon />}
                      onClick={() => {
                        setCampagneLinks(campagne);
                        onOpen();
                      }}
                      mx={2}
                    />
                    <IconButton
                      aria-label="Supprimer la campagne"
                      variant="outline"
                      colorScheme="purple"
                      icon={<DeleteIcon />}
                      onClick={() => setDeletedCampagneId(campagne._id)}
                      mx={2}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lien et QR code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* TODO: replace with env var */}
            {campagneLinks && (
              <Center>
                <VStack spacing={6}>
                  <Text fontSize="lg">{campagneLinks.nomCampagne}</Text>
                  <QRCode value={`${window.location.hostname}/campagnes/${campagneLinks._id}`} fgColor="#6B46C1" />
                  <Link
                    href={`/campagnes/${campagneLinks._id}`}
                    isExternal
                    mt={4}
                    fontSize="sm"
                  >{`${window.location.hostname}/campagnes/${campagneLinks._id}`}</Link>
                </VStack>
              </Center>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewCampagnes;