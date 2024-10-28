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
import { useEffect, useRef } from "react";

import DidYouKnow from "../DidYouKnow";

const CustomRange = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const markerRef = useRef([]);
  const isMobile = breakpoint === "base";
  const savedValue = props.schema.enum.indexOf(props.value) || null;

  useEffect(() => {
    if (!props.value) props.onChange(props.schema.enum[0]);
  }, []);

  return (
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box mx="2">
        <FormLabel as="legend" fontSize="2xl" color="brand.blue.700" requiredIndicator={null}>
          {parse(props.label)}
        </FormLabel>
        <Text fontSize="xs" color="brand.blue.700">
          (Déplace le curseur sur l’émoji qui se rapproche le plus de ton ressenti)
        </Text>
        <Box pt={6} pb={isMobile ? 6 : 12} w={isMobile ? "80%" : "90%"} m="auto" mt={isMobile ? 5 : "auto"}>
          <Slider
            id="slider"
            defaultValue={savedValue}
            min={0}
            max={props.schema.enum.length - 1}
            w="100%"
            m="auto"
            orientation="horizontal"
            height="inherit"
            onChange={(value) => props.onChange(props.schema.enum[value])}
          >
            {props.schema.enum.map((elem, index) => {
              return (
                <SliderMark
                  key={index}
                  value={index}
                  mt={isMobile ? "10px" : "4"}
                  fontSize={isMobile ? "xs" : "sm"}
                  width={isMobile ? "max-content" : "120px"}
                  ml={isMobile ? -markerRef?.current[index]?.offsetWidth / 2 + "px" : "-60px"}
                  maxW={isMobile ? "110px" : 100 / (props.schema.enum.length - 1) + "%"}
                  textAlign={isMobile ? "left" : "center"}
                  bottom={
                    isMobile ? (index % 2 === 0 ? -markerRef?.current[index]?.offsetHeight - 5 + "px" : 5) : "inherit"
                  }
                  minHeight={isMobile ? "20px" : "inherit"}
                  bgColor={index === props.schema.enum.indexOf(props.value) ? "brand.red.500" : "brand.pink.400"}
                  color={index === props.schema.enum.indexOf(props.value) ? "black" : "black"}
                  borderRadius="md"
                  fontWeight="semibold"
                  py="1"
                  onClick={() => props.onChange(props.schema.enum[index])}
                  cursor="pointer"
                  sx={{ pointerEvents: "all!important" }}
                  px={isMobile ? "1" : "0"}
                  ref={(el) => (markerRef.current[index] = el)}
                >
                  {elem}
                </SliderMark>
              );
            })}
            <SliderTrack colorScheme="brand.blue">
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb left={isMobile ? "inherit" : "inherit"} fontSize="xl">
              {props.uiSchema.emojis[props.schema.enum.indexOf(props.value)]}
            </SliderThumb>
          </Slider>
        </Box>
      </Box>
    </>
  );
};

export default CustomRange;
