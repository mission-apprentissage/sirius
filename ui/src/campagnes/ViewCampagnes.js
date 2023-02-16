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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ViewIcon, LinkIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import QRCode from "react-qr-code";

import { _delete } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";

const ViewCampagnes = () => {
  const [deletedCampagneId, setDeletedCampagneId] = useState(null);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [campagneLinks, setCampagneLinks] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [campagnes, loading, error] = useGet(`/api/campagnes/`);

  useEffect(() => {
    if (campagnes) {
      setDisplayedCampagnes(campagnes);
    }
  }, [campagnes]);

  useEffect(() => {
    if (deletedCampagneId) {
      _delete(`/api/campagnes/${deletedCampagneId}`);
      const filteredDisplayedCampagne = displayedCampagnes.filter((campagne) => campagne._id !== deletedCampagneId);
      setDisplayedCampagnes(filteredDisplayedCampagne);
    }
  }, [deletedCampagneId]);

  if (loading || error) return <Spinner size="xl" />;
  return (
    <>
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
                  <QRCode value={`${window.location.hostname}/questionnaires/${campagneLinks._id}`} fgColor="#6B46C1" />
                  <Link
                    href={`${window.location.hostname}/questionnaires/${campagneLinks._id}`}
                    isExternal
                    mt={4}
                    fontSize="sm"
                  >{`${window.location.hostname}/questionnaires/${campagneLinks._id}`}</Link>
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
