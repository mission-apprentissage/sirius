import { FormControl, Box, Textarea, Text, Image } from "@chakra-ui/react";
import nadia from "../../../assets/images/nadia.svg";
import johan from "../../../assets/images/johan.svg";
import salomee from "../../../assets/images/salomee.svg";
import nazir from "../../../assets/images/nazir.svg";
import samy from "../../../assets/images/samy.svg";

const CustomMessageReceived = (props) => {
  const pictoGetter = () => {
    switch (props.schema.picto) {
      case "nadia":
        return nadia;
      case "johan":
        return johan;
      case "salomee":
        return salomee;
      case "nazir":
        return nazir;
      case "samy":
        return samy;
      default:
        return nadia;
    }
  };

  return (
    <Box mx="5">
      <Text fontSize="2xl" fontWeight="semibold" color="cyan.800" mb="5">
        📬 Tu as reçu un message !
      </Text>
      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" mb="5">
        <Box w="50%">
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="cyan.800"
            textAlign="center"
            mx="12"
            lineHeight="24px"
          >
            « {props.label} »
          </Text>
        </Box>
        <Box
          w="50%"
          m="auto"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Image src={pictoGetter()} alt="" maxW="300px" w="70%" />
          {props.schema.legend && (
            <Text fontSize="xs" fontWeight="semibold" color="teal.900" mt="2">
              {props.schema.legend}
            </Text>
          )}
        </Box>
      </Box>
      <FormControl id={props.id}>
        <Textarea
          onChange={(e) => props.onChange(e.target.value)}
          placeholder="Note ici ta réponse à cette question, elle sera transmise au jeune qui te l’a posée !"
          borderColor="purple.50"
          bgColor="purple.50"
          focusBorderColor="purple.50"
          mt="10px"
          value={props.value}
        />
      </FormControl>
    </Box>
  );
};

export default CustomMessageReceived;
