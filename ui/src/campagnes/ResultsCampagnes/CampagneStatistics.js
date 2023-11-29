import { Card, CardHeader, CardBody, Text, SimpleGrid } from "@chakra-ui/react";
import { msToTime } from "../../utils/temoignage";

const CampagneStatistics = ({ campagne }) => {
  const answererCount = campagne.temoignagesCount;
  const champsLibreRate = campagne.champsLibreRate;
  const medianDuration = msToTime(campagne.medianDurationInMs);

  return (
    <SimpleGrid spacing={3} templateColumns="repeat(auto-fill, minmax(170px, 1fr))" w="100%">
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Nombre de répondant{answererCount > 1 ? "s" : ""}
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {answererCount}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Taux de réponse aux champs libres
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {champsLibreRate}%
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Temps médian de passation
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {medianDuration}
          </Text>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default CampagneStatistics;
