import React, { useEffect, useState } from "react";
import { Select } from "chakra-react-select";
import { useSearchParams } from "react-router-dom";
import useFetchLocalEtablissements from "../../hooks/useFetchLocalEtablissements";
import { etablissementLabelGetter } from "../../utils/etablissement";

const ModerationEtablissementPicker = ({ setPickedEtablissementFormationIds }) => {
  const [allEtablissements, setAllEtablissements] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [fetchedLocalEtablissements, loading, error] = useFetchLocalEtablissements();

  useEffect(() => {
    if (fetchedLocalEtablissements) {
      setAllEtablissements(fetchedLocalEtablissements);
    }
  }, [fetchedLocalEtablissements]);

  const matchedEtablissement =
    allEtablissements.find(
      (etablissement) => etablissement.data.siret === searchParams.get("etablissement")
    ) ?? null;

  useEffect(() => {
    if (
      searchParams.get("etablissement") &&
      searchParams.get("etablissement") !== "all" &&
      matchedEtablissement
    ) {
      setPickedEtablissementFormationIds(matchedEtablissement.formationIds);
    }
  }, [matchedEtablissement, searchParams.get("etablissement")]);

  const onChangeHandler = (e) => {
    setSearchParams({ etablissement: e?.data.siret ?? "all" });
  };

  return (
    <Select
      id="etablissement"
      name="etablissement"
      variant="outline"
      size="lg"
      placeholder="Choix de l'établissement"
      isSearchable
      isClearable
      value={matchedEtablissement}
      isLoading={loading}
      isDisabled={loading || !!error}
      getOptionLabel={(option) => etablissementLabelGetter(option.data)}
      getOptionValue={(option) => option.data.siret}
      options={allEtablissements}
      onChange={onChangeHandler}
    />
  );
};

export default ModerationEtablissementPicker;
