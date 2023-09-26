import { Stack, Text } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
const ErrorTemplate = (props) => {
  const { errors } = props;
  if (!errors || errors?.length === 0) return null;

  return (
    <Stack spacing={2} color="orange.500" mt="5">
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
