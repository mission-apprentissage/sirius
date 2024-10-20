import {
  Box,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  useBreakpoint,
} from "@chakra-ui/react";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

import DidYouKnow from "../DidYouKnow";

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
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box>
        <FormLabel as="legend" fontSize="2xl" color="brand.blue.700" requiredIndicator={null}>
          {parse(props.schema.title)}
        </FormLabel>
        <Text fontSize="xs" color="brand.blue.700">
          (Pour chacune de ces propositions déplace le curseur sur l’émoji qui se rapproche le plus de ton ressenti)
        </Text>
        <Box pt={2} pb={isMobile ? 6 : 2} w={isMobile ? "100%" : "90%"} m="auto">
          {props.schema.questions.map((question, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              alignItems="center"
              bgColor={index % 2 !== 0 ? "white" : "brand.blue.100"}
              py="5"
              px="16"
              margin="auto"
              mt="2"
              w="calc(100% + 48px)"
              ml="-24px"
            >
              <Box w={isMobile ? "100%" : "50%"} color="brand.blue.700" fontSize="sm" textAlign="center">
                {question}
              </Box>
              <Box w={isMobile ? "100%" : "50%"}>
                <Slider
                  id="slider"
                  defaultValue={0}
                  min={0}
                  max={3}
                  colorScheme="brand.blue"
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
                      bg="brand.blue.700"
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
                  <SliderTrack colorScheme="brand.blue">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize={26}>{emojiGetter(currentValue[index]?.value || 0)}</SliderThumb>
                </Slider>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default CustomMultiRange;
