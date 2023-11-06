import React, { useState, useRef } from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { etablissementLabelGetter } from "../../utils/etablissement";
import { _get } from "../../utils/httpClient";

const EtablissementInput = ({ formik, setEtablissements }) => {
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
        formik.setFieldValue("etablissements", [
          ...formik.values.etablissements,
          {
            siret: result.etablissements[0].siret,
            onisep_nom: result.etablissements[0].onisep_nom,
            enseigne: result.etablissements[0].enseigne,
            entreprise_raison_sociale: result.etablissements[0].entreprise_raison_sociale,
          },
        ]);
        setEtablissements([
          ...formik.values.etablissements,
          {
            siret: result.etablissements[0].siret,
            onisep_nom: result.etablissements[0].onisep_nom,
            enseigne: result.etablissements[0].enseigne,
            entreprise_raison_sociale: result.etablissements[0].entreprise_raison_sociale,
          },
        ]);
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
        isClearable
        loadOptions={loadEtablissementOptionsHandler}
        isLoading={isLoadingRemoteEtablissement}
        size="lg"
        color="brand.black.500"
        _placeholder={{ color: "brand.black.500" }}
        errorBorderColor="brand.red.500"
        isInvalid={hasError}
        onChange={(e) => {
          if (!e) {
            formik.setFieldValue("etablissements", []);
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
