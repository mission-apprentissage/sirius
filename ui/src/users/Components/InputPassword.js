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

const InputPassword = ({ id, name, formik }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <FormControl isInvalid={!!formik.errors[name] && formik.touched[name]}>
      <InputGroup>
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          onChange={formik.handleChange}
          value={formik.values[name]}
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
      <FormErrorMessage>{formik.errors[name]}</FormErrorMessage>
    </FormControl>
  );
};

export default InputPassword;
