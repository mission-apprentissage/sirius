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
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

const CustomTextareaPrecision = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  return (
    <Box mx={isMobile ? "0" : "5"}>
      <FormControl id={props.id} width="100%" spacing="2">
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Tu peux préciser si tu le souhaites !"
          borderColor="purple.50"
          bgColor="gray.200"
          focusBorderColor="purple.50"
          my="10px"
          value={props.value}
          size="md"
        />
        <Popover>
          <PopoverTrigger>
            <HStack w="fit-content">
              <InfoOutlineIcon color="purple.500" boxSize={4} />
              <Text color="purple.500" fontSize="sm">
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

export default CustomTextareaPrecision;
