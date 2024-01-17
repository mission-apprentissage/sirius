import React from "react";
import { Select } from "chakra-react-select";
import { useSearchParams } from "react-router-dom";

const ModerationFormationPicker = ({ formations }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const allFormations = [{ label: "Toutes les formations", value: "all" }];
  const matchedFormation =
    formations.find((formation) => formation.value === searchParams.get("formation")) ??
    allFormations;

  const onChangeHandler = (e) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("formation", e?.value ?? "all");
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
      value={matchedFormation}
      options={allFormations.concat(formations)}
      onChange={onChangeHandler}
    />
  );
};

export default ModerationFormationPicker;
