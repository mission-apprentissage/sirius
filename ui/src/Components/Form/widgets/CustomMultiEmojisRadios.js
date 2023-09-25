import React, { useState, useEffect } from "react";
import {
  Box,
  useBreakpoint,
  FormLabel,
  Text,
  useRadioGroup,
  useRadio,
  Tag,
} from "@chakra-ui/react";
import DidYouKnow from "../DidYouKnow";

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Tag
        {...checkbox}
        cursor="pointer"
        size="lg"
        variant={input.checked ? "solid" : "subtle"}
        _hover={{
          backgroundColor: "orange.500",
          color: "white",
        }}
        colorScheme="orange"
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
      <Box mx={isMobile ? "0" : "5"}>
        <FormLabel
          as="legend"
          fontSize="2xl"
          fontWeight="semibold"
          color="orange.500"
          requiredIndicator={null}
        >
          {props.schema.title}
        </FormLabel>
        <Text fontSize="xs" color="orange.900">
          Pour chaque proposition, sélectionne la réponse qui se rapproche le plus de ton ressenti
          😉
        </Text>
        <Box pt={2} pb={isMobile ? 6 : 2} w={isMobile ? "100%" : "90%"} m="auto">
          {props.schema.questions.map((question, index) => {
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
                w="100%"
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                bgColor={index % 2 !== 0 ? "white" : "gray.50"}
                alignItems={isMobile ? "intial" : "center"}
                py="5"
                px="5"
                margin="auto"
                mt="2"
              >
                <Box
                  w={isMobile ? "100%" : "50%"}
                  color="orange.800"
                  fontSize="sm"
                  textAlign="center"
                >
                  {question}
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
