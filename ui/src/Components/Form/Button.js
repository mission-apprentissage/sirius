import { Button as ChakraButton } from "@chakra-ui/react";

const Button = ({ children, isLoading = null, width = "min-content", variant = "solid" }) => {
  return (
    <ChakraButton
      borderRadius="md"
      type="submit"
      variant={variant}
      bgColor="brand.blue.700"
      color="white"
      colorScheme="brand.blue"
      width={width}
      isLoading={isLoading}
    >
      {children}
    </ChakraButton>
  );
};
export default Button;
