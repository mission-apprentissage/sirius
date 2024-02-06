import React from "react";
import { Box, Stack, Text, Link } from "@chakra-ui/react";
import { ExternalLinkIcon, DeleteIcon } from "@chakra-ui/icons";
import { etablissementLabelGetter } from "../../../utils/etablissement";

const EtablissementInputList = ({ formik, etablissement, index }) => {
  const handleDeleteEtablissement = (index) => {
    const updatedEtablissements = [...formik.values.etablissements];
    updatedEtablissements.splice(index, 1);
    formik.setFieldValue("etablissements", updatedEtablissements);
  };

  return (
    <Stack direction="row" key={index}>
      <Box bgColor="brand.blue.100" p="15px" position="relative" w="100%">
        <Box
          bgColor="brand.pink.400"
          borderRadius="50px"
          w="20px"
          h="20px"
          position="absolute"
          top="6px"
          left="6px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="12px" fontWeight="semibold">
            {index + 1}
          </Text>
        </Box>
        <Box
          w="20px"
          h="20px"
          position="absolute"
          top="6px"
          right="6px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <DeleteIcon
            cursor="pointer"
            color="brand.red.500"
            onClick={() => handleDeleteEtablissement(index)}
          />
        </Box>
        <Text mt="25px" mb="5px" fontWeight="semibold" textAlign="left">
          {etablissementLabelGetter(etablissement)}
        </Text>
        <Text mb="5px" fontSize="14px" textAlign="left">
          {etablissement.siret}
        </Text>
        <Text mb="10px" fontSize="14px" textAlign="left">
          {etablissement.adresse}
        </Text>
        <Link
          href={`https://catalogue-apprentissage.intercariforef.org/etablissement/${etablissement.id}`}
          target="_blank"
          display="flex"
          alignItems="center"
          color={"brand.blue.700"}
          fontSize="12px"
        >
          <ExternalLinkIcon mr="5px" color={"brand.blue.700"} />
          Voir le détail de l'établissement (CARIF-OREF)
        </Link>
      </Box>
    </Stack>
  );
};

export default EtablissementInputList;
