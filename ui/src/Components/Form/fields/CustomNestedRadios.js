import { useState, Fragment, useEffect } from "react";
import {
  Box,
  useRadioGroup,
  useRadio,
  FormLabel,
  Text,
  useBreakpoint,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { CustomCheckboxes, CustomTextareaPrecision } from "../widgets";

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  return (
    <Box as="label" display="flex">
      <Radio colorScheme="orange" {...input} style={{}}>
        <Box
          {...checkbox}
          cursor="pointer"
          borderRadius="md"
          _checked={{
            bg: "orange.500",
            color: "white",
            borderColor: "orange.500",
          }}
          px={2}
          py={1}
          width="fit-content"
          ml="2"
          color="gray.400"
        >
          {props.children}
        </Box>
      </Radio>
    </Box>
  );
}

const otherInputGetter = (dependencies, props, value) => {
  const otherInput = dependencies.find((dep) =>
    dep.properties[props.name].contains.enum.includes(value)
  );
  return otherInput.properties[props.name + "Autre"];
};

const CustomNestedRadios = (props) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const [nestedValues, setNestedValues] = useState(null);
  const [parentValue, setparentValue] = useState("");
  const options = props.schema.enum;
  const dependencies = props.registry.rootSchema.dependencies[props.name].oneOf;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: props.name,
    onChange: setparentValue,
  });
  const group = getRootProps();

  useEffect(() => {
    props.formContext.handleNested({
      [props.name + "Autre"]: nestedValues,
      [props.name]: parentValue,
    });
  }, [nestedValues, parentValue]);

  props.onChange(parentValue);

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
        <>
          <FormLabel as="legend" fontSize="2xl" fontWeight="semibold" color="orange.500">
            {props.schema.title}
          </FormLabel>
          <Text fontSize="xs" color="orange.900">
            (Plusieurs choix de sous-réponses possibles)
          </Text>
        </>
        <Stack mt="4">
          <RadioGroup {...group}>
            {options.map((value) => {
              const radio = getRadioProps({ value });
              const otherInput = otherInputGetter(dependencies, props, value);

              return (
                <Fragment key={value}>
                  <RadioCard {...radio}>{value}</RadioCard>
                  {parentValue === value && otherInput && (
                    <Box ml="3" mb="5">
                      <NestedInput
                        {...otherInput}
                        onChange={setNestedValues}
                        id={props.name + "Autre"}
                        parentId={props.name}
                        formData={props.formData}
                      />
                    </Box>
                  )}
                </Fragment>
              );
            })}
          </RadioGroup>
        </Stack>
      </Box>
    </>
  );
};

const NestedInput = (props) => {
  if (props.type === "checkboxes") {
    return (
      <CustomCheckboxes {...props} standalone={true} onChange={props.onChange} id={props.id} />
    );
  }
  if (props.type === "textarea") {
    return <CustomTextareaPrecision {...props} />;
  }
};

export default CustomNestedRadios;
