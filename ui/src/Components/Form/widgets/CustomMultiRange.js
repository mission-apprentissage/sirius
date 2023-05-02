import React, { useState, useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  Box,
  useBreakpoint,
  FormLabel,
  ListItem,
  UnorderedList,
  Stack,
} from "@chakra-ui/react";

const emojiGetter = (value) => {
  if (!value) return null;
  const key = Object.keys(value)[0];
  switch (value[key]) {
    case 0:
      return "😰";
    case 1:
      return "😨";
    case 2:
      return "😐";
    case 3:
      return "😌";
    case 4:
      return "😁";
  }
};

const CustomRange = (props) => {
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
    <>
      <FormLabel as="legend" fontSize="lg" fontWeight="semibold">
        {props.schema.title}
      </FormLabel>
      <Box pt={6} pb={isMobile ? 6 : 12} w={isMobile ? "100%" : "90%"} m="auto">
        <UnorderedList listStyleType="none" w="100%" spacing={6} m="0">
          {props.schema.questions.map((question, index) => (
            <Stack key={index} w="100%" direction={isMobile ? "column" : "row"}>
              <ListItem
                w={isMobile ? "100%" : "50%"}
                fontWeight="semibold"
                pl={isMobile ? "0" : "3"}
              >
                {question}
              </ListItem>
              <Slider
                id="slider"
                defaultValue={0}
                min={0}
                max={4}
                colorScheme="purple"
                w={isMobile ? "100%" : "50%"}
                height={isMobile ? "50px" : "inherit"}
                onChange={(value) => {
                  setCurrentValue((prev) => {
                    prev[index] = { [question]: value };
                    return prev;
                  });
                  props.onChange(currentValue);
                }}
              >
                <SliderTrack bgColor="purple.200" />
                <SliderThumb fontSize={26}>{emojiGetter(currentValue[index])}</SliderThumb>
              </Slider>
            </Stack>
          ))}
        </UnorderedList>
      </Box>
    </>
  );
};

export default CustomRange;
