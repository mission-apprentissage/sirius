import { FormControl, FormLabel, Input, Box } from "@chakra-ui/react";
import parse from "html-react-parser";
import DidYouKnow from "../DidYouKnow";

const CustomText = (props) => {
  return (
    <>
      {props.schema.info && <DidYouKnow content={props.schema.info} />}
      <Box mx="2">
        <FormControl variant="floating" id={props.id}>
          <Input
            onChange={(e) => props.onChange(e.target.value)}
            placeholder=" "
            borderColor="purple.400"
            focusBorderColor="purple.400"
            value={props.value}
          />
          <FormLabel>{parse(props.label)}</FormLabel>
        </FormControl>
      </Box>
    </>
  );
};

export default CustomText;
