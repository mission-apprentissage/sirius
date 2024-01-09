import { Card, CardHeader, CardBody, Text, SimpleGrid } from "@chakra-ui/react";
import { VERBATIM_STATUS } from "../../constants";

const ModerationStatistics = ({ verbatims }) => {
  const unmoderatedVerbatims = verbatims.filter((verbatim) => typeof verbatim.value === "string");

  const validatedVerbatims = verbatims.filter(
    (verbatim) => verbatim.value.status === VERBATIM_STATUS.VALIDATED
  );

  const rejectedVerbatims = verbatims.filter(
    (verbatim) =>
      typeof verbatim.value === "object" &&
      (verbatim.value.status === VERBATIM_STATUS.TO_FIX ||
        verbatim.value.status === VERBATIM_STATUS.ALERT ||
        verbatim.value.status === VERBATIM_STATUS.REJECTED)
  );
  console.log({ rejectedVerbatims });
  return (
    <SimpleGrid spacing={3} templateColumns="repeat(auto-fill, minmax(170px, 1fr))" w="100%">
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Verbatims
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {verbatims.length}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Verbatims en attente de modération
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {unmoderatedVerbatims.length}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Verbatims validés
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {validatedVerbatims.length}
          </Text>
        </CardBody>
      </Card>
      <Card variant="filled" bgColor="brand.blue.100" borderRadius="12px">
        <CardHeader pb="0">
          <Text fontSize="sm" fontWeight="500" color="brand.gray.700">
            Verbatims rejetés
          </Text>
        </CardHeader>
        <CardBody pt="5px">
          <Text fontSize="2xl" fontWeight="600">
            {rejectedVerbatims.length}
          </Text>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default ModerationStatistics;
