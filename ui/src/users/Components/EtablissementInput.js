import React, { useState, useRef } from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { etablissementLabelGetter } from "../../utils/etablissement";
import { _get } from "../../utils/httpClient";

const EtablissementInput = ({ formik, setEtablissements, index }) => {
  const timer = useRef();
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);

  const debouncedSiret = (callback, siret) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const result = await _get(
        `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${siret}"}&page=1&limit=1`
      );

      if (result.etablissements?.length > 0) {
        callback(result.etablissements);
      } else {
        callback(null);
      }
    }, 500);
  };

  const loadEtablissementOptionsHandler = (inputValue, callback) => {
    debouncedSiret(callback, inputValue);
    setIsLoadingRemoteEtablissement(false);
  };

  const hasError = !!formik.errors.etablissements && !!formik.touched.etablissements;

  return (
    <FormControl isInvalid={!!formik.errors.etablissement && formik.touched.etablissement}>
      <AsyncSelect
        placeholder="SIRET de votre établissement"
        getOptionLabel={(option) => etablissementLabelGetter(option)}
        getOptionValue={(option) => option?.siret}
        backspaceRemovesValue
        escapeClearsValue
        isClearable={index === 0}
        loadOptions={loadEtablissementOptionsHandler}
        isLoading={isLoadingRemoteEtablissement}
        size="lg"
        color="brand.black.500"
        _placeholder={{ color: "brand.black.500" }}
        errorBorderColor="brand.red.500"
        isInvalid={hasError}
        onChange={(e, { action }) => {
          if (e) {
            const etablissements = [
              ...formik.values.etablissements,
              {
                siret: e.siret,
                onisep_nom: e.onisep_nom,
                enseigne: e.enseigne,
                entreprise_raison_sociale: e.entreprise_raison_sociale,
              },
            ];

            formik.setFieldValue("etablissements", etablissements);
            setEtablissements(etablissements);
          } else {
            if (action === "clear") {
              if (index === 0) {
                formik.setFieldValue("etablissements", [{}]);
                setEtablissements([{}]);
              } else {
                const etablissements = [...formik.values.etablissements];
                etablissements[index] = {};
                formik.setFieldValue("etablissements", etablissements);
                setEtablissements(etablissements);
              }
            }
          }
        }}
        chakraStyles={{
          placeholder: (baseStyles) => ({
            ...baseStyles,
            color: "brand.black.500",
          }),
          dropdownIndicator: () => ({
            display: "none",
          }),
          container: (baseStyles) => ({
            ...baseStyles,
            borderColor: "brand.blue.400",
          }),
          clearIndicator: (baseStyles) => ({
            ...baseStyles,
            color: "brand.blue.400",
            backgroundColor: "transparent",
          }),
        }}
      />
      <FormErrorMessage>{formik.errors.etablissement}</FormErrorMessage>
    </FormControl>
  );
};

export default EtablissementInput;
