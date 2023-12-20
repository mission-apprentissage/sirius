import { Card, CardHeader, CardBody, Text, SimpleGrid } from "@chakra-ui/react";

const SuiviEtablissementsStatistics = ({ etablissements }) => {
  const createdCampagnesCount = etablissements.reduce(
    (accumulator, etablissement) => accumulator + etablissement.campagneIds.length,
    0
  );

  const temoignagesCount = etablissements.reduce(
    (accumulator, etablissement) => accumulator + etablissement.temoignagesCount,
    0
  );

  const champsLibreCount = etablissements.reduce(
    (accumulator, etablissement) => accumulator + etablissement.champsLibreCount,
    0
  );

  return (
    <SimpleGrid spacing={3} templateColumns="repeat(auto-fill, minmax(170px, 1fr))" w="100%">
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Établissements
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {etablissements.length}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Campagnes
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {createdCampagnesCount}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Témoignages
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {temoignagesCount}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Verbatims
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {champsLibreCount}
          </Text>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default SuiviEtablissementsStatistics;
