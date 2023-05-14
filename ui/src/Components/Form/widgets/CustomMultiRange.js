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
  SliderMark,
} from "@chakra-ui/react";

const emojiGetter = (value) => {
  switch (value) {
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
  const [isSliderClicked, setIsSliderClicked] = useState(null);
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const labels = props.uiSchema.labels || ["Très difficile", "Difficile", "Facile", "Très facile"];

  useEffect(() => {
    if (currentValue.length === 0) {
      setCurrentValue(props.schema.questions.map((question) => ({ label: question, value: 0 })));
      props.onChange(currentValue);
    }
  }, []);

  return (
    <Box mx={isMobile ? "0" : "5"}>
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
            flexDirection={isMobile ? "column" : "row"}
            alignItems="center"
            bgColor={index % 2 !== 0 ? "white" : "orange.100"}
            py="5"
            px="5"
          >
            <Box w={isMobile ? "100%" : "50%"} color="orange.800" fontSize="sm" textAlign="center">
              {question}
            </Box>
            <Box w={isMobile ? "100%" : "50%"}>
              <Slider
                id="slider"
                defaultValue={0}
                min={0}
                max={3}
                colorScheme="orange"
                w="100%"
                height={isMobile ? "50px" : "inherit"}
                onChangeStart={() => setIsSliderClicked(index)}
                onChangeEnd={() => setIsSliderClicked(null)}
                onChange={(value) => {
                  setCurrentValue((prev) => {
                    prev[index] = { ...prev[index], value };
                    return prev;
                  });
                  props.onChange(currentValue);
                }}
              >
                {isSliderClicked === index && (
                  <SliderMark
                    value={currentValue[index]?.value || 0}
                    textAlign="center"
                    bg="orange.500"
                    color="white"
                    mt={isMobile ? "-20px" : "-40px"}
                    ml="-55"
                    minWidth="100px"
                    px="2"
                    borderRadius="md"
                  >
                    {labels[currentValue[index]?.value || 0]}
                  </SliderMark>
                )}
                <SliderTrack colorScheme="orange">
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize={26}>
                  {emojiGetter(currentValue[index]?.value || 0)}
                </SliderThumb>
              </Slider>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CustomMultiRange;
