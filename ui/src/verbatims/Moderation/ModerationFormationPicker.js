import React from "react";
import { Select } from "chakra-react-select";
import { useSearchParams } from "react-router-dom";
import useFetchLocalFormations from "../../hooks/useFetchLocalFormations";

const ModerationFormationPicker = ({ pickedEtablissementFormationIds }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const localFormationQuery = pickedEtablissementFormationIds?.map((id) => `id=${id}`).join("&");
  const [formations, loading, error] = useFetchLocalFormations(localFormationQuery);

  const matchedFormation =
    formations?.find((formation) => formation._id === searchParams.get("formation")) ?? null;

  const onChangeHandler = (e) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("formation", e?._id ?? "all");
    newSearchParams.set("page", 1);
    setSearchParams(newSearchParams);
  };

  return (
    <Select
      id="formation"
      name="formation"
      variant="outline"
      size="lg"
      placeholder="Choix de la formation"
      isSearchable
      isClearable
      isLoading={loading}
      isDisabled={loading || !!error}
      value={matchedFormation}
      options={formations?.length ? formations : []}
      getOptionLabel={(option) => option.data.intitule_long}
      getOptionValue={(option) => option._id}
      onChange={onChangeHandler}
    />
  );
};

export default ModerationFormationPicker;
