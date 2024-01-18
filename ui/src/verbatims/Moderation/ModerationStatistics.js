import { Card, CardHeader, CardBody, Text, SimpleGrid } from "@chakra-ui/react";

const ModerationStatistics = ({ count }) => {
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
            {count.totalCount}
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
            {count.pendingCount}
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
            {count.validatedCount}
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
            {count.rejectedCount}
          </Text>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default ModerationStatistics;
