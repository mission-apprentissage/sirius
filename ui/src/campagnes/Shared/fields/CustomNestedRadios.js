import { Box, FormLabel, Radio, RadioGroup, Stack, Text, useRadio, useRadioGroup } from "@chakra-ui/react";
import parse from "html-react-parser";
import { Fragment, useEffect, useState } from "react";

import DidYouKnow from "../DidYouKnow";
import { CustomCheckboxes, CustomTextareaPrecision } from "../widgets";

function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();
  return (
    <Box as="label" display="flex">
      <Radio
        borderColor={props.isFormTouchedAndCurrentElemNotChecked ? "brand.blue.100" : "brand.pink.400"}
        color="brand.black.500"
        _checked={{
          borderColor: "brand.red.500",
          bg: "brand.black.500",
        }}
        {...input}
        style={{}}
      >
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
          width="fit-content"
          ml="2"
          bgColor={props.isFormTouchedAndCurrentElemNotChecked ? "white" : "brand.pink.400"}
          color={props.isFormTouchedAndCurrentElemNotChecked ? "#A0AEC0" : "brand.black.500"}
          my="2"
        >
          {props.children}
        </Box>
      </Radio>
    </Box>
  );
}

const otherInputGetter = (dependencies, props, value) => {
  const otherInput = dependencies?.find((dep) => dep.properties[props.name].contains.enum.includes(value));
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
      <Box as="fieldset" mx="2">
        <>
          <FormLabel as="legend" fontSize="2xl" color="brand.blue.700" requiredIndicator={null}>
            {props.schema.title && parse(props.schema.title)}
          </FormLabel>
        </>
        <Stack mt="4">
          <RadioGroup {...group}>
            {options.map((value) => {
              const radio = getRadioProps({ value });
              const otherInput = otherInputGetter(dependencies, props, value);
              const isFormTouchedAndCurrentElemNotChecked = !!props.formData && props.formData !== value;

              return (
                <Fragment key={value}>
                  <RadioCard {...radio} isFormTouchedAndCurrentElemNotChecked={isFormTouchedAndCurrentElemNotChecked}>
                    {value}
                  </RadioCard>
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
      <>
        <Text fontSize="xs" color="brand.blue.700" my="2">
          Tu peux sélectionner plusieurs réponses 😉
        </Text>{" "}
        <CustomCheckboxes {...props} standalone={true} onChange={props.onChange} id={props.id} />
      </>
    );
  }
  if (props.type === "textarea") {
    return <CustomTextareaPrecision {...props} />;
  }
};

export default CustomNestedRadios;
