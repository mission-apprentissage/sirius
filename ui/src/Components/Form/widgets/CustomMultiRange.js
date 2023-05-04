import React, { useState, useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  Box,
  useBreakpoint,
  FormLabel,
  SliderFilledTrack,
  Badge,
} from "@chakra-ui/react";

const emojiGetter = (value) => {
  if (!value) return null;
  const key = Object.keys(value)[0];
  switch (value[key]) {
    case 0:
      return "😫";
    case 1:
      return "🧐";
    case 2:
      return "😊";
    case 3:
      return "😝";
  }
};

const CustomMultiRange = (props) => {
  const [currentValue, setCurrentValue] = useState([]);
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  useEffect(() => {
    if (currentValue.length === 0) {
      setCurrentValue(props.schema.questions.map((question) => ({ [question]: 0 })));
      props.onChange(currentValue);
    }
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
        {props.schema.title}
      </FormLabel>
      <Box pt={2} pb={isMobile ? 6 : 2} w={isMobile ? "100%" : "90%"} m="auto">
        {props.schema.questions.map((question, index) => (
          <Box
            key={index}
            w="100%"
            display="flex"
            flexDirection="row"
            alignItems="center"
            bgColor={index % 2 !== 0 ? "white" : "orange.100"}
            py="5"
            px="5"
          >
            <Box w="50%">{question}</Box>
            <Box w="50%">
              <Slider
                id="slider"
                defaultValue={0}
                min={0}
                max={3}
                colorScheme="orange"
                w="100%"
                height={isMobile ? "50px" : "inherit"}
                onChange={(value) => {
                  setCurrentValue((prev) => {
                    prev[index] = { [question]: value };
                    return prev;
                  });
                  props.onChange(currentValue);
                }}
              >
                <SliderTrack colorScheme="orange">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize={26}>{emojiGetter(currentValue[index])}</SliderThumb>
              </Slider>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CustomMultiRange;
