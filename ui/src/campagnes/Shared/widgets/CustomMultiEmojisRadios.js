import { Box, FormLabel, Tag, Text, useBreakpoint, useRadio, useRadioGroup } from "@chakra-ui/react";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

import DidYouKnow from "../DidYouKnow";

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" maxWidth="50px">
      <input {...input} />
      <Tag
        {...checkbox}
        cursor="pointer"
        size="lg"
        variant={input.checked ? "solid" : "subtle"}
        _hover={{
          bg: "brand.red.500",
          color: "brand.black.500",
        }}
        _checked={{
          bg: "brand.red.500",
          color: "brand.black.500",
        }}
        color="brand.black.500"
        bgColor="brand.pink.400"
        maxWidth="100px"
        textAlign="center"
        p="2"
      >
        {props.children}
      </Tag>
    </Box>
  );
};

const CustomMultiEmojisRadios = (props) => {
  const [currentValue, setCurrentValue] = useState([]);
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  const emojisMapping = props.uiSchema.emojisMapping;

  useEffect(() => {
    if (currentValue.length === 0) {
      setCurrentValue([]);
      props.onChange([]);
    }
  }, []);

  return (
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box mx="0">
        <FormLabel as="legend" fontSize="2xl" color="brand.blue.700" requiredIndicator={null}>
          {parse(props.schema.title)}
        </FormLabel>
        <Text fontSize="xs" color="brand.blue.700">
          Pour chaque proposition, sélectionne la réponse qui se rapproche le plus de ton ressenti 😉
        </Text>
        <Box pt={2} pb={isMobile ? 6 : 2} w={isMobile ? "100%" : "90%"} m="auto">
          {props.schema.questions.map((question, index) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { getRadioProps } = useRadioGroup({
              id: `question-${index}`,
              name: `question-${index}`,
              onChange: (e) => {
                const newArray = currentValue;
                newArray[index] = { label: question, value: e };
                setCurrentValue(newArray);
                props.onChange(newArray);
              },
              value: currentValue[index]?.value || null,
            });

            return (
              <Box
                key={index}
                w="calc(100% + 48px)"
                ml="-24px"
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                bgColor={index % 2 !== 0 ? "white" : "brand.blue.100"}
                alignItems={isMobile ? "intial" : "center"}
                py="5"
                px="16"
                mt="2"
              >
                <Box w={isMobile ? "100%" : "50%"} color="brand.blue.700" fontSize="sm" textAlign="center">
                  {parse(question)}
                </Box>
                <Box
                  direction="row"
                  mt={4}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="space-between"
                  w={isMobile ? "initial" : "50%"}
                >
                  {emojisMapping.map((emojiMapping, optionIndex) => {
                    const radio = getRadioProps({ value: emojiMapping.value });

                    return (
                      <Box key={optionIndex}>
                        <Text textAlign="center" mb="3" fontSize="30px">
                          {emojiMapping.emoji}
                        </Text>
                        <RadioCard {...radio}>{emojiMapping.value}</RadioCard>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default CustomMultiEmojisRadios;
