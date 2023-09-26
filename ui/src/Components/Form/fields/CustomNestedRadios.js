import { useState, Fragment, useEffect } from "react";
import {
  Box,
  useRadioGroup,
  useRadio,
  FormLabel,
  Text,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import parse from "html-react-parser";
import { CustomCheckboxes, CustomTextareaPrecision } from "../widgets";
import DidYouKnow from "../DidYouKnow";

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
  const otherInput = dependencies?.find((dep) =>
    dep.properties[props.name].contains.enum.includes(value)
  );
  return otherInput?.properties[props.name + "Autre"];
};

const CustomNestedRadios = (props) => {
  const [nestedValues, setNestedValues] = useState(null);
  const [parentValue, setparentValue] = useState("");
  const options = props.schema.enum;
  const dependencies = props.registry.rootSchema.dependencies[props.name]?.oneOf;
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
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box as="fieldset" mx="5">
        <>
          <FormLabel as="legend" fontSize="2xl" color="orange.500" requiredIndicator={null}>
            {props.schema.title && parse(props.schema.title)}
          </FormLabel>
          <Text fontSize="xs" color="orange.900">
            Tu peux sélectionner plusieurs réponses 😉
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
