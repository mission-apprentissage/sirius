import React, { useState } from "react";
import { Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import EtablissementInput from "./EtablissementInput";
import EtablissementInputList from "./EtablissementInputList";

const AddSiret = ({ formik, setError }) => {
  const [addNewSiret, setAddNewSiret] = useState(true);

  const etablissements = formik.values.etablissements;

  return (
    <>
      {etablissements &&
        etablissements.map((etablissement, index) => (
          <EtablissementInputList
            key={index}
            etablissement={etablissement}
            index={index}
            formik={formik}
          />
        ))}
      {(addNewSiret || !etablissements.length) && (
        <EtablissementInput formik={formik} setError={setError} setAddNewSiret={setAddNewSiret} />
      )}
      {etablissements[etablissements.length - 1]?.siret && (
        <Stack
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={() => setAddNewSiret(true)}
          mb="10px"
        >
          <AddIcon boxSize="10px" color="brand.blue.700" />
          <Text fontSize="sm" color="brand.blue.700">
            Ajouter un SIRET
          </Text>
        </Stack>
      )}
    </>
  );
};

export default AddSiret;
