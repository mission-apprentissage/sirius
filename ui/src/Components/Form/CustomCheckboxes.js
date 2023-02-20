import { Box, useCheckboxGroup, useCheckbox, Wrap } from "@chakra-ui/react";

const CheckboxCard = (props) => {
  const { getInputProps, getCheckboxProps } = useCheckbox(props);

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
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

const CustomCheckboxes = (props) => {
  const options = props.options.enumOptions.map((option) => option.label);

  const { getCheckboxProps } = useCheckboxGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
  });

  return (
    <fieldset>
      <legend>{props.label}</legend>
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
    </fieldset>
  );
};

export default CustomCheckboxes;
