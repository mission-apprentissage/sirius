import { Box, useRadioGroup, useRadio, FormLabel, Text, Tag } from "@chakra-ui/react";

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
  const options = props.options.enumOptions.map((option) => option.label);
  const emojis = props.uiSchema.emojis;

  const { getRadioProps } = useRadioGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
    value: props.value,
  });

  return (
    <>
      {props.schema.info && (
        <Box bgColor="orange.50" width="90%" mx="5" display="flex" p="4" mb="4">
          <Text fontSize="3xl">💡</Text>
          <Box ml="2">
            <Text color="orange.500" fontWeight="bold">
              Le savais-tu ?
            </Text>
            <Text color="orange.500">{props.schema.info}</Text>
          </Box>
        </Box>
      )}
      <Box as="fieldset" mx="5">
        <FormLabel as="legend" fontSize="2xl" fontWeight="semibold" color="orange.500">
          {props.label}
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
          {options.map((value, index) => {
            const radio = getRadioProps({ value });
            return (
              <Box key={index}>
                <Text textAlign="center" mb="3" fontSize="30px">
                  {emojis[index]}
                </Text>
                <RadioCard {...radio}>{value}</RadioCard>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default CustomEmojisRadios;
