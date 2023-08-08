import React from "react";
import { useToast } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, FormLabel, Box, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import useFetchRemoteFormations from "../../hooks/useFetchRemoteFormations";
import useFetchLocalFormations from "../../hooks/useFetchLocalFormations";

const formatOptionLabel = (props, isFormationAlreadyAdded = null) => {
  props.isDisabled = isFormationAlreadyAdded;
  return (
    <Box>
      <Text>{props.intitule_long}</Text>
      <Text fontSize="xs">
        {props.lieu_formation_adresse_computed || props.lieu_formation_adresse}
      </Text>
      <Text fontSize="xs">{props.tags?.join(" - ")}</Text>
    </Box>
  );
};

const FormationPicker = ({ formik, inputSiret }) => {
  const toast = useToast();

  const [fetchedRemoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(inputSiret || formik.values.localEtablissement?.data?.siret);

  const localFormationQuery = formik.values.localEtablissement?.formationIds
    ?.filter(Boolean)
    ?.map((id) => `id=${id}`)
    .join("&");

  const [fetchedLocalFormations] = useFetchLocalFormations(localFormationQuery);

  if (errorRemoteFormations) {
    toast({
      title: "Une erreur s'est produite",
      description: errorRemoteFormations?.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <>
      {(formik.values.localEtablissement || formik.values.etablissement) && (
        <FormControl
          isInvalid={!!formik.errors.formation && formik.touched.formation}
          isDisabled={loadingRemoteFormations || errorRemoteFormations}
        >
          <FormLabel htmlFor="formation">Formation</FormLabel>
          <Select
            placeholder="Sélectionner une formation"
            size="md"
            options={fetchedRemoteFormations}
            getOptionLabel={(option) =>
              `${option.intitule_long} - ${option.tags.join(", ")} \n ${
                option.lieu_formation_adresse_computed
              }`
            }
            getOptionValue={(option) => option._id}
            formatOptionLabel={(props) => {
              const initialFormationId = formik.initialValues.formation?._id;
              // allow same formaiton in edition mode
              if (!initialFormationId) {
                const localFormationIds = fetchedLocalFormations?.map(
                  (formation) => formation.data._id
                );

                const isFormationAlreadyAdded = localFormationIds?.includes(props.id);
                return formatOptionLabel(props, isFormationAlreadyAdded);
              }
              return formatOptionLabel(props);
            }}
            onChange={(option) => formik.setFieldValue("formation", option)}
            value={formik.values.formation?.data || formik.values.formation}
            isSearchable
            isLoading={loadingRemoteFormations}
          />
          <FormErrorMessage>{formik.errors.formation}</FormErrorMessage>
        </FormControl>
      )}
    </>
  );
};

export default FormationPicker;
