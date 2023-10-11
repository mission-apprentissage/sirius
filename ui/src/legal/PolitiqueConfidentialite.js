import {
  Box,
  Stack,
  Text,
  useBreakpoint,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

const PolitiqueConfidentialite = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Stack direction="column" w="100%" m="auto" my="32px" color="brand.blue.700">
      <Box w={isMobile ? "90%" : "70%"} bg="white" p={6} m="auto" mt={isMobile ? "5" : "auto"}>
        <Stack spacing="4">
          <Text fontSize="3xl" fontWeight="semibold" mb="32px">
            Politique de confidentialité
          </Text>
          <Text fontSize="3xl" fontWeight="semibold" mb="32px">
            SIRIUS
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Qui est responsable de Sirius ?
          </Text>
          <Text>
            Sirius est développé au sein de la Mission InserJeunes et permet via un questionnaire de
            recueillir les témoignages et retours d’expérience d’apprentis et de les exposer aux
            collégiens pour les aider dans leurs choix d’orientation.
          </Text>
          <Text>
            Le responsable de traitement est la Délégation générale à l’emploi et à la formation
            professionnelle, représentée par Monsieur Bruno Lucas.{" "}
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Quelles sont les données que nous traitons ?
          </Text>
          <Text>
            Sirius ne traite pas de données à caractère personnel mais il existe des zones de champs
            libres dans le questionnaire. Une mention d’information précise que les champs libres ne
            doivent pas faire l’objet d’informations relatives aux opinions philosophiques,
            syndicales, religieuses ou à l’orientation sexuelle. Ces données sont trop sensibles !
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Qui nous aide à traiter les données ?
          </Text>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="brand.blue.700">Sous-traitant</Th>
                  <Th color="brand.blue.700">Pays destinataire</Th>
                  <Th color="brand.blue.700">Traitement réalisé</Th>
                  <Th color="brand.blue.700">Garanties</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>OVH</Td>
                  <Td>France</Td>
                  <Td>Hébergement</Td>
                  <Td>
                    <Link
                      target="_blank"
                      href="https://www.ovhcloud.com/fr/personal-data-protection/"
                    >
                      https://www.ovhcloud.com/fr/personal-data-protection/
                    </Link>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Onisep</Td>
                  <Td>France</Td>
                  <Td>ST DGEFP</Td>
                  <Td>
                    <Link target="_blank" href="https://www.onisep.fr/donnees-personnelles">
                      https://www.onisep.fr/donnees-personnelles
                    </Link>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Quels sont vos droits ?
          </Text>
          <Text>Vous bénéficiez d’un :</Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>Droit d’accès ;</ListItem>
              <ListItem>Droit de rectification ;</ListItem>
              <ListItem>Droit de limitation ;</ListItem>
              <ListItem>Droit d’opposition.</ListItem>
            </UnorderedList>
          </Box>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Cookies
          </Text>
          <Text>
            Un cookie est un fichier déposé sur votre terminal lors de la visite d’un site. Il a
            pour but de collecter des informations relatives à votre navigation et de vous adresser
            des services adaptés à votre terminal (ordinateur, mobile ou tablette).
          </Text>
          <Text>
            En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le
            traitement des données à caractère personnel et la protection de la vie privée dans le
            secteur des communications électroniques, transposée à l’article 82 de la loi n°78-17 du
            6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs ou
            cookies suivent deux régimes distincts.
          </Text>
          <Text>
            Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de
            faciliter la communication par voie électronique sont dispensés de consentement
            préalable au titre de l’article 82 de la loi n°78-17 du 6 janvier 1978.
          </Text>
          <Text>
            Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas pour finalité
            exclusive de faciliter la communication par voie électronique doivent être consenti par
            l’utilisateur.
          </Text>
          <Text>
            Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques
            constitue une base légale au sens du RGPD et doit être entendu au sens de l'article 6-a
            du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif
            à la protection des personnes physiques à l'égard du traitement des données à caractère
            personnel et à la libre circulation de ces données.
          </Text>
          <Text>
            Les cookies recensés sur Sirius ne sont que des cookies strictement nécessaires au
            service dispensés de consentement préalable.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PolitiqueConfidentialite;
