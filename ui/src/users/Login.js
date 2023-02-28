import { useState, useContext } from "react";
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
import { Redirect, useHistory } from "react-router-dom";
import { _post } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import Miley from "../assets/images/miley.png";

const validationSchema = Yup.object({
  username: Yup.string().email("Le champ n'est pas au bon format").required("Ce champ est obligatoire"),
  password: Yup.string().required("Ce champ est obligatoire"),
});

const Login = () => {
  const history = useHistory();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);

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
    onSubmit: async ({ username, password }) => {
      setIsSubmitting(true);
      const result = await _post(`/api/users/login`, { username, password });

      if (result.success) {
        toast({
          title: "Vous êtes connecté",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUserContext((oldValues) => {
          return { ...oldValues, token: result.token };
        });
        setIsSubmitting(false);
        history.push("/campagnes");
      } else if (result.statusCode === 401) {
        toast({
          title: "Une erreur est survenue",
          description: "Mauvais email ou mot de passe",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      } else if (result.statusCode === 500) {
        toast({
          title: "Une erreur est survenue",
          description: "Merci de réessayer",
          duration: 5000,
          isClosable: true,
        });
        setIsSubmitting(false);
      }
    },
  });

  if (!userContext.loading && userContext.token) return <Redirect to="/campagnes" />;

  return (
    <Flex flexDirection="column" backgroundColor="gray.100" justifyContent="center" alignItems="center" w="100%">
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar size="lg" src={Miley} alt="" />
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
              <Button
                borderRadius="md"
                type="submit"
                variant="solid"
                colorScheme="purple"
                width="full"
                isLoading={isSubmitting}
              >
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
