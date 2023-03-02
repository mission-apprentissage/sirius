import { Box, Wrap, useRadioGroup, useRadio, FormLabel } from "@chakra-ui/react";

const RadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        borderColor="purple.400"
        color="purple.400"
        _checked={{
          bg: "purple.400",
          color: "white",
          borderColor: "purple.400",
        }}
        _hover={{
          bg: "purple.400",
          color: "white",
          borderColor: "purple.400",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

const CustomRadios = (props) => {
  const options = props.options.enumOptions.map((option) => option.label);

  const { getRadioProps } = useRadioGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
  });

  return (
    <fieldset>
      <FormLabel as="legend" fontSize="lg" fontWeight="semibold">
        {props.label}
      </FormLabel>
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
    </fieldset>
  );
};

export default CustomRadios;
