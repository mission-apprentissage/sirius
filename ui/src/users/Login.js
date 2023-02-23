import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="purple.500" />
        <Heading color="purple.400">Bienvenue</Heading>
        <Box maxW="400px">
          <form>
            <Stack spacing={4} p="2rem" backgroundColor="whiteAlpha.900" boxShadow="md" borderRadius="md">
              <FormControl variant="floating">
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<EmailIcon />} />
                  <Input type="email" placeholder="Adresse email" />
                </InputGroup>
              </FormControl>
              <FormControl variant="floating">
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<LockIcon />} />
                  <Input type={showPassword ? "text" : "password"} placeholder="Mot de passe" />
                  <InputRightElement mr="5px">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button borderRadius="md" type="submit" variant="solid" colorScheme="purple" width="full">
                Connexion
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
