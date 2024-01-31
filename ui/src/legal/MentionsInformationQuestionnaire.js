import {
  Box,
  Stack,
  Text,
  useBreakpoint,
  Link,
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
} from "@chakra-ui/react";

const MentionsInformationQuestionnaire = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Stack direction="column" w="100%" m="auto" my="32px" color="brand.blue.700">
      <Box w={isMobile ? "90%" : "70%"} bg="white" p={6} m="auto" mt={isMobile ? "5" : "auto"}>
        <Stack spacing="4">
          <Text fontSize="3xl" fontWeight="semibold" mb="32px">
            Mention d’information sur le questionnaire “Sirius”
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            Qui est responsable de Sirius ?
          </Text>
          <Text>
            Sirius est développé avec l’appui de la Mission InserJeunes et permet via un
            questionnaire, de recueillir les témoignages et retours d’expérience d’apprentis et de
            jeunes, et de les exposer aux candidats à l’apprentissage pour les aider dans leurs
            choix d’orientation.
          </Text>
          <Text>
            Le ministère du travail (la Délégation générale à l’emploi et à la formation
            professionnelle, représentée par Monsieur Bruno Lucas) et l’ONISEP sont en charge de
            Sirius.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Que faisons-nous des questionnaires et l’associons-nous à une donnée à caractère
            personnel ?
          </Text>
          <Text>
            Sirius ne traite pas de données à caractère personnel mais il existe des zones de champs
            libres dans le questionnaire. Une mention d’information précise que les champs libres ne
            doivent pas faire l’objet d’informations relatives aux opinions philosophiques,
            syndicales, religieuses ou à l’orientation sexuelle. Ces données sont trop sensibles !
          </Text>
          <Text>
            Par ailleurs, nous vous informons que les données ne sont pas identifiantes, car une URL
            est rattachée à un diplôme et non pas à une personne.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Où sont hébergés et qui peut accéder aux questionnaires ?
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
        </Stack>
      </Box>
    </Stack>
  );
};

export default MentionsInformationQuestionnaire;
