import React from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  SliderMark,
  Box,
  useBreakpoint,
  FormLabel,
} from "@chakra-ui/react";

const CustomRange = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const savedValue = props.schema.enum.indexOf(props.value) || null;

  return (
    <>
      <FormLabel as="legend" fontSize="lg" fontWeight="semibold">
        {props.schema.title}
      </FormLabel>
      <Box pt={6} pb={isMobile ? 6 : 12} w={isMobile ? "100%" : "90%"} m="auto">
        <Slider
          id="slider"
          defaultValue={savedValue}
          min={0}
          max={props.schema.enum.length - 1}
          colorScheme="purple"
          w="100%"
          orientation={isMobile ? "vertical" : "horizontal"}
          height={isMobile ? "300px" : "inherit"}
          onChangeEnd={(value) => props.onChange(props.schema.enum[value])}
        >
          {props.schema.enum.map((elem, index) => {
            return (
              <SliderMark
                key={index}
                value={index}
                mt={isMobile ? "10px" : "3"}
                fontSize="sm"
                width={isMobile ? "70%" : "150px"}
                ml={isMobile ? "10px" : "-75px"}
                maxW={isMobile ? "100%" : 100 / (props.schema.enum.length - 1) + "%"}
                textAlign={isMobile ? "left" : "center"}
                bottom={
                  isMobile
                    ? `calc(${(index / (props.schema.enum.length - 1)) * 100}% -  20px)!important`
                    : "inherit"
                }
                minHeight={isMobile ? "37px" : "inherit"}
              >
                {elem}
              </SliderMark>
            );
          })}
          <SliderTrack bgColor="purple.200" left={isMobile ? "0!important" : "inherit"} />
          <SliderThumb bgColor="purple.400" left={isMobile ? "0!important" : "inherit"} />
        </Slider>
      </Box>
    </>
  );
};

export default CustomRange;
