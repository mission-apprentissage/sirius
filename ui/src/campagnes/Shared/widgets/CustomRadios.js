import { Box, FormLabel, Tag, Text, useRadio, useRadioGroup, Wrap } from "@chakra-ui/react";
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
          bg: "brand.red.500",
          color: "brand.black.500",
        }}
        _checked={{
          bg: "brand.red.500",
          color: "brand.black.500",
        }}
        color="brand.black.500"
        bgColor="brand.pink.400"
        p="2"
      >
        {props.children}
      </Tag>
    </Box>
  );
};

const CustomRadios = (props) => {
  const options = props.options.enumOptions.map((option) => option.label);

  const { getRadioProps } = useRadioGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
    value: props.value,
  });

  return (
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box as="fieldset" mx="2">
        <FormLabel as="legend" fontSize="2xl" color="brand.blue.700" requiredIndicator={null}>
          {parse(props.label)}
        </FormLabel>
        <Text fontSize="xs" color="brand.blue.700">
          une seule réponse possible
        </Text>
        <Wrap spacing={2} direction="row" mt={4}>
          {options.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            );
          })}
        </Wrap>
      </Box>
    </>
  );
};

export default CustomRadios;
