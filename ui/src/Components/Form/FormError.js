import { Box, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

const FormError = ({ title, hasError, errorMessages }) => {
  if (!hasError) return null;
  return (
    <Alert status="error" flexDirection="row" my="10px">
      <AlertIcon />
      <Box>
        <AlertTitle fontWeight="600">{title}</AlertTitle>
        {errorMessages.map((errorMessage) => (
          <AlertDescription display="inline-block" key={errorMessage}>
            {errorMessage}
          </AlertDescription>
        ))}
      </Box>
    </Alert>
  );
};

export default FormError;
