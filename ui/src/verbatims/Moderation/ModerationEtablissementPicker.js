import React from "react";
import { Select } from "chakra-react-select";
import { useSearchParams } from "react-router-dom";

const ModerationEtablissementPicker = ({ etablissements }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const allEtablissements = [{ label: "Tous les établissements", value: "all" }];
  const matchedEtablissement =
    etablissements.find(
      (etablissement) => etablissement.value === searchParams.get("etablissement")
    ) ?? allEtablissements;

  const onChangeHandler = (e) => {
    setSearchParams({ etablissement: e?.value ?? "all" });
  };

  return (
    <Select
      id="etablissement"
      name="etablissement"
      variant="outline"
      size="lg"
      placeholder="Choix de l'établissement"
      isSearchable
      value={matchedEtablissement}
      options={allEtablissements.concat(etablissements)}
      onChange={onChangeHandler}
    />
  );
};

export default ModerationEtablissementPicker;
