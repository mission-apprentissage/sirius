import { InfoIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import mains from "../../../assets/images/mains.svg";

const CustomTextareaPrecision = (props) => {
  return (
    <Box mx="2">
      <FormControl id={props.id} width="100%" spacing="2">
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Tu peux préciser si tu le souhaites !"
          borderColor="brand.pink.400"
          bgColor="brand.pink.50"
          focusBorderColor="brand.pink.400"
          my="10px"
          value={props.value}
          size="md"
          _placeholder={{ color: "brand.black.500" }}
          spellCheck
        />
        <Popover>
          <PopoverTrigger>
            <HStack mt="10px" w="fit-content">
              <InfoIcon color="brand.blue.700" boxSize={4} />
              <Text color="brand.blue.700" fontSize="sm" sx={{ marginTop: "0px" }} fontStyle="italic">
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
                  Notamment, ne communiquez pas vos opinions philosophiques, syndicales, politiques ou sur votre vie
                  sexuelle.{" "}
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

export default CustomTextareaPrecision;
