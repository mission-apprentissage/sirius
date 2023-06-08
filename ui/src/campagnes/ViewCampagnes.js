import React, { useState, useEffect, useContext } from "react";
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
  Tooltip,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, ViewIcon, LinkIcon, EditIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import { _delete } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";
import { UserContext } from "../context/UserContext";

const CampagneTable = ({ campagnes, navigate, setCampagneLinks, onOpen, setDeletedCampagneId }) => {
  return (
    <>
      <TableContainer my={4} p={2} rounded="md" w="100%" boxShadow="md" bg="white">
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Liens</Th>
              <Th>Nom de la campagne</Th>
              <Th>CFA</Th>
              <Th>Formation</Th>
              <Th>Début</Th>
              <Th>Fin</Th>
              <Th>Actions</Th>
              <Th>Crée le</Th>
              <Th>Modifié le</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campagnes?.map((campagne) => (
              <Tr key={campagne._id}>
                <Td>
                  <IconButton
                    aria-label="Voir le lien et le QR code de la campagne"
                    variant="outline"
                    colorScheme="purple"
                    icon={<LinkIcon />}
                    onClick={() => {
                      setCampagneLinks(campagne);
                      onOpen();
                    }}
                  />
                </Td>
                <Td sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <Tooltip label={campagne.nomCampagne} hasArrow arrowSize={15}>
                    {campagne.nomCampagne}
                  </Tooltip>
                </Td>
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
                    onClick={() => navigate(`/campagnes/${campagne._id}`)}
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
                    aria-label="Modifier la campagne"
                    variant="outline"
                    colorScheme="purple"
                    icon={<EditIcon />}
                    onClick={() => navigate(`/campagnes/${campagne._id}/edition`)}
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
                <Td>
                  <Tooltip
                    label={new Date(campagne.createdAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}
                    hasArrow
                    arrowSize={15}
                  >
                    {new Date(campagne.createdAt).toLocaleDateString("fr-FR")}
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip
                    label={new Date(campagne.updatedAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                    })}
                    hasArrow
                    arrowSize={15}
                  >
                    {new Date(campagne.updatedAt).toLocaleDateString("fr-FR")}
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

const ViewCampagnes = () => {
  const [userContext] = useContext(UserContext);
  const [deletedCampagneId, setDeletedCampagneId] = useState(null);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [filteredCampagne, setFilteredCampagne] = useState([]);
  const [campagneLinks, setCampagneLinks] = useState(null);
  const [searchCampagneTerm, setSearchCampagneTerm] = useState(null);
  const navigate = useNavigate();
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
      const result = await _delete(`/api/campagnes/${deletedCampagneId}`, userContext.token);

      if (result?.deletedCount) {
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
      const filteredDisplayedCampagne = displayedCampagnes.filter(
        (campagne) => campagne._id !== deletedCampagneId
      );
      setDisplayedCampagnes(filteredDisplayedCampagne);
      setDeletedCampagneId(null);
    };
    if (deletedCampagneId) {
      deleteCampagne();
    }
  }, [deletedCampagneId, displayedCampagnes, toast]);

  useEffect(() => {
    if (searchCampagneTerm) {
      const campagnes = displayedCampagnes.filter((item) =>
        item.nomCampagne.includes(searchCampagneTerm)
      );
      setFilteredCampagne(campagnes);
    }
  }, [searchCampagneTerm]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchCampagneTerm(value);
  };

  if (loading || error || !displayedCampagnes.length) return <Spinner size="xl" />;

  const campagnesSource = searchCampagneTerm ? filteredCampagne : displayedCampagnes;

  const notStartedCampagnes = campagnesSource.filter(
    (campagne) => new Date(campagne.startDate) > new Date()
  );

  const endedCampagnes = campagnesSource.filter(
    (campagne) => new Date(campagne.endDate) < new Date()
  );

  const currentCampagnes = campagnesSource.filter(
    (campagne) =>
      new Date(campagne.startDate) < new Date() && new Date(campagne.endDate) > new Date()
  );

  return (
    <Box display="flex" flexDirection="column" width="80%" m="auto">
      <Box mb="5" display="flex" flexDirection="row" alignItems="center">
        <IconButton
          aria-label="Ajouter une campagne"
          variant="outline"
          colorScheme="purple"
          icon={<AddIcon />}
          onClick={() => navigate(`/campagnes/ajout`)}
        />
        <Text ml="5">Créer une campagne</Text>
      </Box>
      <Box mb="4">
        <Input
          id="nomCampagne"
          name="nomCampagne"
          type="text"
          variant="solid"
          placeholder="Chercher une campagne"
          onChange={handleSearch}
        />
      </Box>
      <Tabs isFitted>
        <TabList>
          <Tab>En cours ({currentCampagnes.length})</Tab>
          <Tab>À venir ({notStartedCampagnes.length})</Tab>
          <Tab>Terminées ({endedCampagnes.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CampagneTable
              campagnes={currentCampagnes}
              navigate={navigate}
              setCampagneLinks={setCampagneLinks}
              onOpen={onOpen}
              setDeletedCampagneId={setDeletedCampagneId}
              handleSearch={handleSearch}
            />
          </TabPanel>
          <TabPanel>
            <CampagneTable
              campagnes={notStartedCampagnes}
              navigate={navigate}
              setCampagneLinks={setCampagneLinks}
              onOpen={onOpen}
              setDeletedCampagneId={setDeletedCampagneId}
              handleSearch={handleSearch}
            />
          </TabPanel>
          <TabPanel>
            <CampagneTable
              campagnes={endedCampagnes}
              navigate={navigate}
              setCampagneLinks={setCampagneLinks}
              onOpen={onOpen}
              setDeletedCampagneId={setDeletedCampagneId}
              handleSearch={handleSearch}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
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
                  <QRCode
                    value={`${window.location.protocol}//${window.location.hostname}/campagnes/${campagneLinks._id}`}
                    fgColor="#6B46C1"
                  />
                  <Link
                    href={`/campagnes/${campagneLinks._id}`}
                    isExternal
                    mt={4}
                    fontSize="sm"
                    wordBreak="break-all"
                    maxW="100%"
                  >{`${window.location.protocol}//${window.location.hostname}/campagnes/${campagneLinks._id}`}</Link>
                </VStack>
              </Center>
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ViewCampagnes;
