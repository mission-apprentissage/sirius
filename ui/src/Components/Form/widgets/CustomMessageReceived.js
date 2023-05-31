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
import { InfoOutlineIcon } from "@chakra-ui/icons";
import nadia from "../../../assets/images/nadia.svg";
import johan from "../../../assets/images/johan.svg";
import salomee from "../../../assets/images/salomee.svg";
import nazir from "../../../assets/images/nazir.svg";
import samy from "../../../assets/images/samy.svg";

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
    <Box mx={isMobile ? "0" : "5"}>
      <Text fontSize="2xl" fontWeight="semibold" color="cyan.800" mb="5">
        📬 Tu as reçu un message !
      </Text>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        mb="5"
      >
        <Box w={isMobile ? "100%" : "50%"}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="cyan.800"
            textAlign="center"
            mx={isMobile ? "2" : "12"}
            lineHeight="24px"
          >
            « {props.label} »
          </Text>
        </Box>
        <Box
          w={isMobile ? "100%" : "50%"}
          m="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Image src={pictoGetter()} alt="" maxW="300px" w="70%" />
          {props.schema.legend && (
            <Text fontSize="xs" fontWeight="semibold" color="teal.900" mt="2">
              {props.schema.legend}
            </Text>
          )}
        </Box>
      </Box>
      <FormControl id={props.id}>
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Note ici ta réponse à cette question, elle sera transmise au jeune qui te l’a posée !"
          borderColor="purple.50"
          bgColor="purple.50"
          focusBorderColor="purple.50"
          mt="10px"
          value={props.value}
        />
        <Popover>
          <PopoverTrigger>
            <HStack mt="10px">
              <InfoOutlineIcon color="purple.500" boxSize={4} />
              <Text color="purple.500" fontSize="sm" sx={{ marginTop: "0px" }}>
                Mention d’information – Champs libres
              </Text>
            </HStack>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Stack>
                <Text>
                  Attention à vos{" "}
                  <Text as="span" fontWeight="semibold" color="purple.500">
                    données
                  </Text>
                  , elles sont{" "}
                  <Text as="span" fontWeight="semibold" color="purple.500">
                    importantes
                  </Text>{" "}
                  pour nous !
                </Text>
                <Text>
                  C’est pour cela que nous invitons à nous communiquer les{" "}
                  <Text as="span" fontWeight="semibold" color="purple.500">
                    seules informations et données strictement nécessaires.
                  </Text>
                </Text>
                <Text>
                  Notamment, ne communiquez pas vos opinions{" "}
                  <Text as="span" fontWeight="semibold" color="purple.500">
                    philosophiques, syndicales, politiques ou sur votre vie sexuelle.{" "}
                  </Text>
                </Text>
                <Text fontWeight="semibold" color="purple.500">
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
