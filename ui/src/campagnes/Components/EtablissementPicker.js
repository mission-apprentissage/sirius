import React, { useState, useRef } from "react";
import { FormControl, FormErrorMessage, FormLabel, Text, useToast } from "@chakra-ui/react";
import { Select, AsyncSelect } from "chakra-react-select";
import { _get } from "../../utils/httpClient";
import useFetchLocalEtablissements from "../../hooks/useFetchLocalEtablissements";

const localEtablissementsChecker = (localEtablissements, inputSiret) =>
  localEtablissements.find((etablissement) => etablissement.data.siret === inputSiret);

const EtablissementPicker = ({ formik, setInputSiret }) => {
  const [showAddEtablissement, setShowAddEtablissement] = useState(false);
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);
  const timer = useRef();
  const toast = useToast();

  const [fetchedLocalEtablissements, loadingLocalEtablissements, errorLocalEtablissements] =
    useFetchLocalEtablissements();

  const debouncedSiret = (callback, siret) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const result = await _get(
        `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${siret}"}&page=1&limit=1`
      );

      if (result.etablissements?.length > 0) {
        callback(result.etablissements);
        formik.setFieldValue("etablissement", result.etablissements[0]);
      } else {
        callback(null);
      }
    }, 500);
  };

  const loadEtablissementOptionsHandler = (inputValue, callback) => {
    setIsLoadingRemoteEtablissement(true);
    const localEtablissementFound = localEtablissementsChecker(
      fetchedLocalEtablissements,
      inputValue
    );
    if (localEtablissementFound) {
      setShowAddEtablissement(false);
      formik.setFieldValue("localEtablissement", localEtablissementFound);
      callback(null);
      toast({
        description: "L'établissement existe déjà et a été sélectionné",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setIsLoadingRemoteEtablissement(false);
    } else {
      setInputSiret(inputValue);
      debouncedSiret(callback, inputValue);
      setIsLoadingRemoteEtablissement(false);
    }
  };

  if (errorLocalEtablissements) {
    toast({
      title: "Une erreur s'est produite",
      description: errorLocalEtablissements?.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <>
      <FormControl
        isInvalid={!!formik.errors.localEtablissement && formik.touched.localEtablissement}
        isDisabled={showAddEtablissement || loadingLocalEtablissements || errorLocalEtablissements}
      >
        <FormLabel htmlFor="localEtablissements">Établissements existants</FormLabel>
        <Select
          placeholder="Sélectionner un établissement existant"
          size="md"
          options={fetchedLocalEtablissements}
          getOptionLabel={(option) =>
            option?.data?.onisep_nom ||
            option?.data?.enseigne ||
            option?.data?.entreprise_raison_sociale
          }
          getOptionValue={(option) => option?._id}
          onChange={(option) => {
            formik.setFieldValue("localEtablissement", option);
            formik.setFieldValue("formation", null);
          }}
          value={formik.values.localEtablissement}
          isLoading={loadingLocalEtablissements}
          isSearchable
          isClearable
        />
        <FormErrorMessage>{formik.errors.localEtablissement}</FormErrorMessage>
        <Text
          fontSize="xs"
          mt="10px"
          textDecoration="underline"
          color="purple.500"
          cursor="pointer"
          w="max-content"
          onClick={() => {
            setShowAddEtablissement(!showAddEtablissement);
            formik.setFieldValue("localEtablissement", null);
            formik.setFieldValue("etablissement", null);
            formik.setFieldValue("formation", null);
          }}
        >
          {showAddEtablissement ? "Choisir un établissement existant" : "Ajouter un établissement"}
        </Text>
      </FormControl>
      {showAddEtablissement && (
        <FormControl
          isInvalid={!!formik.errors.etablissement && formik.touched.etablissement}
          isDisabled={isLoadingRemoteEtablissement}
        >
          <FormLabel htmlFor="etablissement">Établissement</FormLabel>
          <AsyncSelect
            placeholder="Entrer un SIRET"
            size="md"
            getOptionLabel={(option) =>
              option?.onisep_nom || option?.enseigne || option?.entreprise_raison_sociale
            }
            getOptionValue={(option) => option?.siret}
            backspaceRemovesValue
            escapeClearsValue
            isClearable
            loadOptions={loadEtablissementOptionsHandler}
            isLoading={isLoadingRemoteEtablissement}
          />
          <FormErrorMessage>{formik.errors.etablissement}</FormErrorMessage>
        </FormControl>
      )}
    </>
  );
};

export default EtablissementPicker;
