import {
  Box,
  useRadioGroup,
  useRadio,
  FormLabel,
  Text,
  Tag,
  useBreakpoint,
} from "@chakra-ui/react";

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
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  const emojisMapping = props.uiSchema.emojisMapping;

  const { getRadioProps } = useRadioGroup({
    name: props.id,
    onChange: (e) => props.onChange(e),
    value: props.value,
  });

  return (
    <>
      {props.schema.info && (
        <Box
          bgColor="purple.50"
          width="100%"
          display="flex"
          p="4"
          mb="4"
          alignItems="center"
          justifyContent={isMobile ? "center" : "initial"}
        >
          <Box
            bgColor="purple.500"
            borderRadius="100%"
            width="38px"
            height="38px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            w={isMobile ? "100px" : "40px"}
          >
            <Text fontSize="2xl">💡</Text>
          </Box>
          <Box ml="2">
            <Text color="purple.600" fontWeight="semibold">
              Le savais-tu ?
            </Text>
            <Text color="purple.600">{props.schema.info}</Text>
          </Box>
        </Box>
      )}
      <Box as="fieldset" mx="5">
        <FormLabel
          as="legend"
          fontSize="2xl"
          fontWeight="semibold"
          color="orange.500"
          requiredIndicator={null}
        >
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
