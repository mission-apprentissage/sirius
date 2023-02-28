import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Logo from "../assets/images/logo.svg";
import MileySmall from "../assets/images/miley_small.png";

const Links = [
  {
    label: "Campagnes",
    href: "/campagnes",
  },
];

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg="gray.300" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Ouvrir le menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box>
              <Link href="/">
                <img src={Logo} alt="Logo Sirius" />
              </Link>
            </Box>
            <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map((link) => (
                <Link
                  key={link}
                  href={link.href}
                  px={2}
                  py={1}
                  color="grey.500"
                  rounded="md"
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems="center">
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW="0">
                <Avatar size="sm" src={MileySmall} />
              </MenuButton>
              <MenuList>
                <MenuItem>Profil</MenuItem>
                <MenuDivider />
                <MenuItem>Se déconnecter</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              {Links.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
