import {
  FormControl,
  Box,
  Textarea,
  Text,
  Image,
  useBreakpoint,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import parse from "html-react-parser";
import nadia from "../../../assets/images/nadia.svg";
import johan from "../../../assets/images/johan.svg";
import salomee from "../../../assets/images/salomee.svg";
import nazir from "../../../assets/images/nazir.svg";
import samy from "../../../assets/images/samy.svg";
import mains from "../../../assets/images/mains.svg";

const CustomMessageReceived = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  const pictoGetter = () => {
    switch (props.schema.picto) {
      case "nadia":
        return nadia;
      case "johan":
        return johan;
      case "salomee":
        return salomee;
      case "nazir":
        return nazir;
      case "samy":
        return samy;
      default:
        return nadia;
    }
  };

  return (
    <Box mx="2" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Image src={pictoGetter()} alt="" maxW="300px" w="70%" my="5" />
      <Box
        w={isMobile ? "100%" : "50%"}
        m="auto"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {props.schema.legend && (
          <Text fontSize="md" fontWeight="400" color="brand.blue.700" my="3">
            {parse(props.schema.legend)}
          </Text>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        mb="5"
        w="100%"
      >
        <Box
          w={isMobile ? "100%" : "50%"}
          py="5"
          px="3"
          borderRadius="0px 20px 20px 20px"
          bgColor="brand.blue.100"
        >
          <Text
            fontSize="md"
            color="brand.black.500"
            textAlign="center"
            mx={isMobile ? "2" : "12"}
            lineHeight="24px"
          >
            « {parse(props.label)} »
          </Text>
        </Box>
      </Box>
      <FormControl id={props.id}>
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Répondre"
          borderColor="brand.pink.400"
          bgColor="brand.pink.50"
          focusBorderColor="brand.pink.400"
          mt="10px"
          value={props.value}
          borderRadius="20px 20px 0px 20px"
          color="brand.black.500"
          _placeholder={{ color: "brand.black.500" }}
        />
        <Popover>
          <PopoverTrigger>
            <HStack mt="10px" w="fit-content">
              <InfoIcon color="brand.blue.700" boxSize={4} />
              <Text
                color="brand.blue.700"
                fontSize="sm"
                sx={{ marginTop: "0px" }}
                fontStyle="italic"
              >
                Mention d’information – Champs libres
              </Text>
            </HStack>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Stack textAlign="center">
                <Text fontWeight="600" fontSize="md" color="brand.blue.700">
                  Mention d’information Sirius
                </Text>
                <Text fontWeight="400" fontSize="sm" color="brand.blue.700">
                  Champs libres
                </Text>
                <Text fontWeight="600" fontSize="14px" color="brand.black.500">
                  Attention à vos données, elles sont importantes pour nous !
                </Text>
                <Image src={mains} alt="" objectFit="contain" w="80%" mx="auto" my="5" />
                <Text color="brand.black.500">
                  C’est pour cela que nous invitons à nous communiquer les{" "}
                  <Text as="span" fontWeight="semibold">
                    seules informations et données strictement{" "}
                  </Text>
                  nécessaires.
                </Text>
                <Text color="brand.black.500">
                  Notamment, ne communiquez pas vos opinions philosophiques, syndicales, politiques
                  ou sur votre vie sexuelle.{" "}
                </Text>
                <Text fontWeight="semibold" color="brand.black.500">
                  Ces données sont trop personnelles !
                </Text>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </FormControl>
    </Box>
  );
};

export default CustomMessageReceived;
