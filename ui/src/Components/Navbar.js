import { ChevronDownIcon, ChevronRightIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/images/logo.svg";
import MileySmall from "../assets/images/miley_small.png";
import { USER_ROLES, USER_STATUS } from "../constants";
import { UserContext } from "../context/UserContext";
import { apiGet } from "../utils/api.utils";

const NAV_ITEMS = [
  {
    label: "Campagnes",
    children: [
      {
        label: "Ajout",
        subLabel: "Ajouter une campagne",
        href: "/campagnes/ajout",
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Gestion",
        subLabel: "Gérer les campagnes",
        href: "/campagnes/gestion",
        roles: [USER_ROLES.ADMIN],
      },
    ],
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Témoignages",
    children: [
      {
        label: "Gestion",
        subLabel: "Gérer les témoignages d'une campagne",
        href: "/temoignages/gestion",
        roles: [USER_ROLES.ADMIN],
      },
    ],
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Questionnaires",
    children: [
      {
        label: "Ajout",
        subLabel: "Ajouter un questionnaire",
        href: "/questionnaires/ajout",
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Gestion",
        subLabel: "Gérer les questionnaires",
        href: "/questionnaires/gestion",
        roles: [USER_ROLES.ADMIN],
      },
    ],
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Utilisateurs",
    children: [
      {
        label: "Gestion",
        subLabel: "Gérer les utilisateurs",
        href: "/utilisateurs/gestion",
        roles: [USER_ROLES.ADMIN],
      },
    ],
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Verbatims",
    children: [
      {
        label: "Modération",
        subLabel: "Modérer les verbatims",
        href: "/verbatims/moderation",
        roles: [USER_ROLES.ADMIN],
      },
    ],
    roles: [USER_ROLES.ADMIN],
  },
  {
    label: "Suivi",
    children: [
      {
        label: "Établissements",
        subLabel: "Suivre les statistiques des établissements",
        href: "/suivi/etablissements",
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Campagnes",
        subLabel: "Suivre et exporter les statistiques des campagnes",
        href: "/suivi/campagnes",
        roles: [USER_ROLES.ADMIN],
      },
    ],
    roles: [USER_ROLES.ADMIN],
  },
];

const filterNavItemsByRole = (items, currentUserRole) => {
  return items.reduce((acc, item) => {
    if (item.roles.includes(currentUserRole)) {
      const filteredChildren = item.children ? filterNavItemsByRole(item.children, currentUserRole) : undefined;

      acc.push({
        ...item,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};

const MenuWithSubnavigation = () => {
  const [userContext] = useContext(UserContext);
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    const result = await apiGet(`/api/users/logout`, {
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });
    if (result.success) {
      navigate(0);
    } else {
      toast({
        title: "Une erreur est survenue",
        description: "Merci de réessayer",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Flex bgColor="brand.blue.100" color="gray.600" minH="60px" py={{ base: 2 }} px={{ base: 4 }} align="center">
        <Flex ml={{ base: -2 }} display={{ base: "flex", md: "none" }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }} alignItems="center">
          <Box ml="50px">
            <Link href="/">
              <img src={Logo} alt="Logo Sirius" />
            </Link>
          </Box>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Flex alignItems="center">
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW="0">
              <Avatar size="sm" src={MileySmall} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const [userContext] = useContext(UserContext);
  const isActive = userContext.user?.status === USER_STATUS.ACTIVE;
  const filteredNavItems = isActive ? filterNavItemsByRole(NAV_ITEMS, userContext.user?.role) : [];

  return (
    <Stack direction="row" spacing={4}>
      {filteredNavItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize="sm"
                fontWeight={500}
                color="gray.600"
                _hover={{
                  textDecoration: "none",
                  color: "gray.800",
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent border={0} boxShadow="xl" bg="white" p="4" rounded="xl" minW="sm">
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link href={href} role="group" display="block" p={2} rounded="md" _hover={{ bg: "purple.50" }}>
      <Stack direction="row" align="center">
        <Box>
          <Text transition="all .3s ease" _groupHover={{ color: "purple.400" }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="purple.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  const [userContext] = useContext(UserContext);
  const isActive = userContext.user?.status === USER_STATUS.ACTIVE;

  const filteredNavItems = isActive ? filterNavItemsByRole(NAV_ITEMS, userContext.user?.role) : [];

  return (
    <Stack bg="white" p={4} display={{ md: "none" }}>
      {filteredNavItems.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color="gray.600">
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack mt={2} pl={4} borderLeft={1} borderStyle="solid" borderColor="gray.200" align="start">
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default MenuWithSubnavigation;
