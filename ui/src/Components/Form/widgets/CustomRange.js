import React, { useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  SliderMark,
  SliderFilledTrack,
  Box,
  useBreakpoint,
  FormLabel,
  Badge,
  Text,
} from "@chakra-ui/react";

const CustomRange = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const savedValue = props.schema.enum.indexOf(props.value) || null;

  useEffect(() => {
    if (!props.value) props.onChange(props.schema.enum[0]);
  }, []);

  return (
    <Box mx="5">
      <FormLabel
        as="legend"
        fontSize="2xl"
        fontWeight="semibold"
        color="orange.500"
        requiredIndicator={
          <Badge bgColor="orange.500" color="white" ml="2">
            *
          </Badge>
        }
      >
        {props.label}
      </FormLabel>
      <Text fontSize="xs" color="orange.900">
        (Déplace le curseur sur l’émoji qui se rapproche le plus de ton ressenti)
      </Text>
      <Box pt={6} pb={isMobile ? 6 : 12} w={isMobile ? "100%" : "90%"} m="auto">
        <Slider
          id="slider"
          defaultValue={savedValue}
          min={0}
          max={props.schema.enum.length - 1}
          colorScheme="orange"
          w="100%"
          orientation={isMobile ? "vertical" : "horizontal"}
          height={isMobile ? "300px" : "inherit"}
          onChange={(value) => props.onChange(props.schema.enum[value])}
        >
          {props.schema.enum.map((elem, index) => {
            return (
              <SliderMark
                key={index}
                value={index}
                mt={isMobile ? "10px" : "4"}
                fontSize="sm"
                width={isMobile ? "70%" : "120px"}
                ml={isMobile ? "10px" : "-60px"}
                maxW={isMobile ? "100%" : 100 / (props.schema.enum.length - 1) + "%"}
                textAlign={isMobile ? "left" : "center"}
                bottom={
                  isMobile
                    ? `calc(${(index / (props.schema.enum.length - 1)) * 100}% -  20px)!important`
                    : "inherit"
                }
                minHeight={isMobile ? "37px" : "inherit"}
                bgColor={
                  index === props.schema.enum.indexOf(props.value) ? "orange.500" : "orange.50"
                }
                color={index === props.schema.enum.indexOf(props.value) ? "white" : "orange.800"}
                borderRadius="md"
                fontWeight="semibold"
                py="1"
              >
                {elem}
              </SliderMark>
            );
          })}
          <SliderTrack colorScheme="orange">
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb left={isMobile ? "0!important" : "inherit"} fontSize="xl">
            {props.uiSchema.emojis[props.schema.enum.indexOf(props.value)]}
          </SliderThumb>
        </Slider>
      </Box>
    </Box>
  );
};

export default CustomRange;
