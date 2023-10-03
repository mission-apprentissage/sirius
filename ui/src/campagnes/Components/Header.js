import React, { useContext } from "react";
import { Spinner, Text, Stack, Image, Flex, useBreakpoint } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Button from "../../Components/Form/Button";
import IoSchoolSharp from "../../assets/icons/IoSchoolSharp.svg";
import IoAddSharp from "../../assets/icons/IoAddSharp.svg";
import HiUser from "../../assets/icons/HiUser.svg";
import GoEye from "../../assets/icons/GoEye.svg";
import MdQuestionAnswer from "../../assets/icons/MdQuestionAnswer.svg";

const Header = ({ hasActionButton, title, img, children }) => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();

  const isMobile = breakpoint === "base";

  if (userContext.loading) return <Spinner />;

  if (!userContext.token) return null;

  return (
    <Stack w="100%">
      <Stack
        w="100%"
        mt={isMobile ? "20px" : "40px"}
        direction={isMobile && hasActionButton ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "flex-end"}
        justifyContent="space-between"
      >
        <Stack>
          <Text color="brand.blue.700" fontSize="xl" fontWeight="600">
            Vous êtes connecté en tant que :
          </Text>
          <Stack direction={hasActionButton || isMobile ? "column" : "row"}>
            <Stack direction="row" align="center">
              <Image src={IoSchoolSharp} alt="" />
              <Text color="brand.blue.700" fontSize="lg">
                {userContext?.etablissementLabel}
              </Text>
            </Stack>
            {!hasActionButton && !isMobile && <Text mx="10px">-</Text>}
            <Stack direction="row" align="center">
              <Image src={HiUser} alt="" />
              <Text color="brand.blue.700" fontSize="lg">
                {userContext?.firstName} {userContext?.lastName} - {userContext?.email}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        {hasActionButton && (
          <>
            <Button
              isLink
              onClick={() => navigate("/campagnes/ajout")}
              leftIcon={<Image src={IoAddSharp} alt="" />}
              w={isMobile ? "100%" : "min-content"}
            >
              Créer campagne
            </Button>
            <Flex alignItems="space-between">
              <Button
                isLink
                onClick={() => navigate("/questionnaires//apercu")} //TODO questionnaire preview link
                leftIcon={<Image src={GoEye} alt="" />}
                variant="outline"
                mx={isMobile ? "0" : "8px"}
                mr={isMobile ? "4px" : "8px"}
                w={isMobile ? "calc(50% - 12x)" : "min-content"}
              >
                Questionnaire
              </Button>
              <Button
                isLink
                onClick={() => navigate("/temoignages/dashboard")}
                leftIcon={<Image src={MdQuestionAnswer} alt="" />}
                variant="outline"
                mx={isMobile ? "0" : "8px"}
                ml={isMobile ? "4px" : "8px"}
                w={isMobile ? "calc(50% - 12px)" : "min-content"}
              >
                Dashboard
              </Button>
            </Flex>
          </>
        )}
      </Stack>
      <Stack direction="row" w="100%" py={isMobile ? "24px" : "65px"}>
        <Stack direction="column" w="80%">
          {title && (
            <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
              {title}
            </Text>
          )}
          {children}
        </Stack>
        {img && !isMobile && <Image src={img} maxW="350px" alt="" />}
      </Stack>
    </Stack>
  );
};

export default Header;
