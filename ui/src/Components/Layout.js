import { Flex, Container, VStack } from "@chakra-ui/react";

const Layout = ({ children }) => (
  <Container maxW="container.lg" bg="gray.100">
    <Flex py={20}>{children}</Flex>
  </Container>
);

export default Layout;
