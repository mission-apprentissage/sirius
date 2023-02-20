import { chakra, Text, useCheckboxGroup, useCheckbox, Wrap } from "@chakra-ui/react";

const CustomCheckbox = (props) => {
  const { state, getInputProps, getLabelProps, htmlProps } = useCheckbox(props);
  return (
    <chakra.label
      bg={state.isChecked ? "purple.400" : "white"}
      border="1px solid"
      borderColor="purple.400"
      color={state.isChecked ? "white" : "purple.400"}
      rounded="md"
      px={3}
      py={3}
      cursor="pointer"
      width="auto"
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Text {...getLabelProps()}>{props.value}</Text>
    </chakra.label>
  );
};

const CustomCheckboxes = (props) => {
  const options = props.options.enumOptions;
  const { getCheckboxProps } = useCheckboxGroup();
  return (
    <fieldset>
      <legend>{props.label}</legend>
      <Wrap spacing={2} direction="row" mt={4}>
        {options.map((option) => (
          <CustomCheckbox {...getCheckboxProps({ value: option.value, label: option.label })} />
        ))}
      </Wrap>
    </fieldset>
  );
};

export default CustomCheckboxes;
