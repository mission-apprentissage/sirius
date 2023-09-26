import {
  FormControl,
  Textarea,
  Box,
  useBreakpoint,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import mains from "../../../assets/images/mains.svg";

const CustomTextareaPrecision = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Box mx={isMobile ? "0" : "5"}>
      <FormControl id={props.id} width="100%" spacing="2">
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Tu peux préciser si tu le souhaites !"
          borderColor="#FEEBCB"
          bgColor="orange.50"
          focusBorderColor="#FEEBCB"
          my="10px"
          value={props.value}
          size="md"
          _placeholder={{ color: "orange.800" }}
        />
        <Popover>
          <PopoverTrigger>
            <HStack mt="10px" w="fit-content">
              <InfoIcon color="orange.800" boxSize={4} />
              <Text color="orange.800" fontSize="sm" sx={{ marginTop: "0px" }} fontStyle="italic">
                Mention d’information – Champs libres
              </Text>
            </HStack>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Stack textAlign="center">
                <Text fontWeight="600" fontSize="md">
                  Mention d’information Sirius
                </Text>
                <Text fontWeight="400" fontSize="sm">
                  Champs libres
                </Text>
                <Text fontWeight="600" fontSize="14px" color="purple.900">
                  Attention à vos données, elles sont importantes pour nous !
                </Text>
                <Image src={mains} alt="" objectFit="contain" w="80%" mx="auto" my="5" />
                <Text color="purple.900">
                  C’est pour cela que nous invitons à nous communiquer les{" "}
                  <Text as="span" fontWeight="semibold">
                    seules informations et données strictement{" "}
                  </Text>
                  nécessaires.
                </Text>
                <Text color="purple.900">
                  Notamment, ne communiquez pas vos opinions philosophiques, syndicales, politiques
                  ou sur votre vie sexuelle.{" "}
                </Text>
                <Text fontWeight="semibold" color="purple.900">
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

export default CustomTextareaPrecision;
