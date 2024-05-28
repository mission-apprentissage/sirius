import React, { useEffect, useState } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Input } from "@codegouvfr/react-dsfr/Input";
import useFetchLocalFormations from "../../hooks/useFetchLocalFormations";

const ModerationFormationPicker = ({ pickedEtablissementFormationIds, setPickedFormationId }) => {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState(search);

  const { localFormations, isSuccess, isError } = useFetchLocalFormations({
    search,
    formationIds: pickedEtablissementFormationIds,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, setSearch]);

  if (isError) {
    return (
      <Alert
        title="Une erreur s'est produite dans la récupération des formations"
        description="Merci de réessayer ultérieurement"
        severity="error"
      />
    );
  }

  return (
    <div>
      <Input
        label={`Rechercher une formation (${localFormations?.length || 0})`}
        disabled={!isSuccess || (!localFormations?.length && !search)}
        nativeInputProps={{
          value: inputValue,
          placeholder: "Par intitulé",
          onChange: (e) => setInputValue(e.target.value),
        }}
      />
      <Select
        label="Choix de la formation"
        nativeSelectProps={{
          onChange: (event) => setPickedFormationId(event.target.value),
        }}
        disabled={!isSuccess || !localFormations?.length}
        options={
          (localFormations?.length &&
            localFormations.map((formation) => ({
              value: formation._id,
              label: `${formation.data.intitule_long}`,
            }))) ||
          []
        }
      />
    </div>
  );
};

export default ModerationFormationPicker;
