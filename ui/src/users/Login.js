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
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { _post } from "../utils/httpClient";

const validationSchema = Yup.object({
  username: Yup.string().email("Le champ n'est pas au bon format").required("Ce champ est obligatoire"),
  password: Yup.string().required("Ce champ est obligatoire"),
});

const Login = () => {
  const history = useHistory();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      formation: "",
      startDate: "",
      endDate: "",
      questionnaire: "",
      questionnaireUI: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log({ values });
    },
  });

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
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4} p="2rem" backgroundColor="whiteAlpha.900" boxShadow="md" borderRadius="md">
              <FormControl isInvalid={!!formik.errors.username && formik.touched.username}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<EmailIcon />} />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Adresse email"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                </InputGroup>
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.password && formik.touched.password}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<LockIcon />} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  <InputRightElement mr="5px">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
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
