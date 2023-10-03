import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Image,
  IconButton,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import HiOutlineEye from "../../assets/icons/HiOutlineEye.svg";
import HiOutlineEyeOff from "../../assets/icons/HiOutlineEyeOff.svg";

const InputPassword = ({ handleChange, value, error, touched }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <FormControl isInvalid={!!error && touched}>
      <InputGroup>
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          onChange={handleChange}
          value={value}
          size="lg"
          color="brand.black.500"
          _placeholder={{ color: "brand.black.500" }}
          borderColor="brand.blue.400"
        />
        <InputRightElement>
          {showPassword ? (
            <IconButton
              bgColor="transparent"
              _hover={{
                bgColor: "transparent",
              }}
              size="sm"
              top="4px"
              right="4px"
              onClick={handleShowClick}
              icon={<Image src={HiOutlineEyeOff} alt="Cacher le mot de passe" />}
            />
          ) : (
            <IconButton
              bgColor="transparent"
              _hover={{
                bgColor: "transparent",
              }}
              size="sm"
              top="4px"
              right="4px"
              onClick={handleShowClick}
              icon={<Image src={HiOutlineEye} alt="Afficher le mot de passe" />}
            />
          )}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputPassword;
