import { Box, FormLabel, Text, useCheckbox, useCheckboxGroup, Wrap } from "@chakra-ui/react";
import parse from "html-react-parser";

import DidYouKnow from "../DidYouKnow";

const CheckboxCard = (props) => {
  const { getInputProps, getCheckboxProps } = useCheckbox({ ...props, required: false }); // native required on multiple checkboxes is not supported

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="md"
        _checked={{
          bg: "brand.red.500",
          color: "brand.black.500",
        }}
        px={2}
        py={1}
        color="brand.black.500"
        bgColor="brand.pink.400"
      >
        {props.children}
      </Box>
    </Box>
  );
};

const CustomCheckboxes = (props) => {
  const options = props.standalone ? props.enum : props.options.enumOptions.map((option) => option.label);
  const { getCheckboxProps } = useCheckboxGroup({
    id: props.id,
    name: props.name,
    onChange: (e) => {
      return props.standalone ? props.onChange(e, props.id) : props.onChange(e);
    },
    value: props.value,
  });

  return (
    <>
      {props.schema?.info && <DidYouKnow content={props.schema.info} />}
      <Box as="fieldset" mx="2">
        {!props.standalone && (
          <>
            <FormLabel as="legend" fontSize="2xl" color="brand.blue.700" requiredIndicator={null}>
              {parse(props.label)}
            </FormLabel>
            <Text fontSize="xs" color="brand.blue.700">
              <i>Tu peux sélectionner plusieurs réponses</i> 😉
            </Text>
          </>
        )}
        <Wrap spacing={2} direction="row" mt={4}>
          {options.map((value) => {
            const checkbox = getCheckboxProps({ value });
            return (
              <CheckboxCard key={value} {...checkbox}>
                {value}
              </CheckboxCard>
            );
          })}
        </Wrap>
      </Box>
    </>
  );
};

export default CustomCheckboxes;
