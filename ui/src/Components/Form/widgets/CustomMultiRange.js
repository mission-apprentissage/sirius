import React, { useState, useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  Box,
  useBreakpoint,
  FormLabel,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
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
        <TableContainer>
          <Table variant="striped" colorScheme="orange">
            <Tbody>
              {props.schema.questions.map((question, index) => (
                <Tr key={index}>
                  <Td>{question}</Td>
                  <Td w="100%">
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
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CustomRange;
