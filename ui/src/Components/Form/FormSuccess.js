import { Box, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

const FormSuccess = ({ title, message }) => {
  return (
    <Alert status="success" flexDirection="row" my="10px">
      <AlertIcon />
      <Box>
        {title && <AlertTitle fontWeight="600">{title}</AlertTitle>}
        <AlertDescription display="inline-block">{message}</AlertDescription>
      </Box>
    </Alert>
  );
};

export default FormSuccess;
