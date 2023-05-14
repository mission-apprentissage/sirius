import {
  Box,
  useCheckboxGroup,
  useCheckbox,
  Wrap,
  FormLabel,
  Badge,
  Text,
  Tag,
  useBreakpoint,
} from "@chakra-ui/react";

const CheckboxCard = (props) => {
  const { getInputProps, getCheckboxProps } = useCheckbox({ ...props, required: false }); // native required on multiple checkboxes is not supported

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
        p={2}
      >
        {props.children}
      </Tag>
    </Box>
  );
};

const CustomCheckboxes = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const options = props.options.enumOptions.map((option) => option.label);

  const { getCheckboxProps } = useCheckboxGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
    value: props.value,
  });

  return (
    <Box as="fieldset" mx={isMobile ? "0" : "5"}>
      <FormLabel
        as="legend"
        fontSize="2xl"
        fontWeight="semibold"
        color="orange.500"
        requiredIndicator={
          <Badge bgColor="orange.500" color="white" ml="2">
            *
          </Badge>
        }
      >
        {props.label}
      </FormLabel>
      <Text fontSize="xs" color="orange.900">
        (plusieurs choix de réponses possibles)
      </Text>
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
  );
};

export default CustomCheckboxes;
