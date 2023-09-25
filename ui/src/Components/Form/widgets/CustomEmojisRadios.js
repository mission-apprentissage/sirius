import { Box, useRadioGroup, useRadio, FormLabel, Text, Tag } from "@chakra-ui/react";
import parse from "html-react-parser";
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

const CustomEmojisRadios = (props) => {
  const emojisMapping = props.uiSchema.emojisMapping;

  const { getRadioProps } = useRadioGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
    value: props.value,
  });

  return (
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box as="fieldset" mx="5">
        <FormLabel as="legend" fontSize="2xl" color="orange.500" requiredIndicator={null}>
          {parse(props.label)}
        </FormLabel>
        <Text fontSize="xs" color="orange.900">
          Sélectionne la réponse qui se rapproche le plus de ton ressenti 😉{" "}
        </Text>
        <Box
          spacing={2}
          direction="row"
          mt={4}
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
          alignItems="space-evenly"
        >
          {emojisMapping.map((emojiMapping, index) => {
            const radio = getRadioProps({ value: emojiMapping.value });
            return (
              <Box key={index}>
                <Text textAlign="center" mb="3" fontSize="30px">
                  {emojiMapping.emoji}
                </Text>
                <RadioCard {...radio}>{emojiMapping.value}</RadioCard>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default CustomEmojisRadios;
