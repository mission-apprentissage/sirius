import { InfoIcon } from "@chakra-ui/icons";
import { Stack, Text } from "@chakra-ui/react";
const ErrorTemplate = (props) => {
  const { errors } = props;
  if (!errors || errors?.length === 0) return null;

  return (
    <Stack spacing={2} color="brand.blue.700" mt="5">
      {errors?.map((error) => (
        <Text key={error} display="flex" alignItems="center">
          <InfoIcon mr="2" />
          {error}
        </Text>
      ))}
    </Stack>
  );
};

export default ErrorTemplate;
