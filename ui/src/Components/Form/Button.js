import { Button as ChakraButton } from "@chakra-ui/react";

const Button = ({
  children,
  isLink = false,
  isLoading = null,
  width = "min-content",
  variant = "solid",
  leftIcon = null,
  size = "lg",
  ...props
}) => {
  const isOutline = variant === "outline";
  return (
    <ChakraButton
      borderRadius="md"
      variant={variant}
      bgColor={isOutline ? "white" : "brand.blue.700"}
      color={isOutline ? "brand.blue.700" : "white"}
      colorScheme="brand.blue"
      width={width}
      isLoading={isLoading}
      leftIcon={leftIcon}
      size={size}
      {...props}
      {...(!isLink && { type: "submit" })}
    >
      {children}
    </ChakraButton>
  );
};
export default Button;
