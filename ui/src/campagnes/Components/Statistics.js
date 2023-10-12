import { Card, CardHeader, CardBody, Text, SimpleGrid } from "@chakra-ui/react";
import { msToTime } from "../../utils/temoignage";

const getFinishedCampagnes = (campagnes) => {
  return campagnes.filter((campagne) => new Date(campagne.endDate) < new Date());
};

const getAnswererCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.temoignagesCount, 0);
};

const getChampsLibreRate = (campagnes) => {
  const sum = campagnes.reduce((acc, campagne) => acc + campagne.champsLibreRate, 0);
  return Math.round(sum / campagnes.length);
};

const getMedianDuration = (campagnes) => {
  const sum = campagnes.reduce((acc, campagne) => acc + campagne.medianDurationInMs, 0);
  return msToTime(Math.round(sum / campagnes.length));
};

const Statistics = ({ campagnes }) => {
  const campagnesCount = campagnes.length;
  const finishedCampagnesCount = getFinishedCampagnes(campagnes).length;
  const answererCount = getAnswererCount(campagnes);
  const champsLibreRate = campagnes.length ? getChampsLibreRate(campagnes) : "0";
  const medianDuration = campagnes.length ? getMedianDuration(campagnes) : "0 min";
  const pluralOrNot = campagnes.length > 1 ? "s" : "";

  return (
    <SimpleGrid spacing={3} templateColumns="repeat(auto-fill, minmax(170px, 1fr))" w="100%">
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Campagne{pluralOrNot} créée{pluralOrNot}
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {campagnesCount}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Campagne{pluralOrNot} finie{pluralOrNot}
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {finishedCampagnesCount}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Nombre de répondant{pluralOrNot}
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

export default Statistics;
