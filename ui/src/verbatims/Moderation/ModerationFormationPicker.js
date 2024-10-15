import React, { useEffect, useState } from "react";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import useFetchLocalFormations from "../../hooks/useFetchLocalFormations";

const ModerationFormationPicker = ({ pickedEtablissementSiret, setPickedFormationId }) => {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState(search);

  const { localFormations, isSuccess, isError } = useFetchLocalFormations({
    search,
    etablissementSiret: pickedEtablissementSiret,
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
      <Select
        label={`Choix de la formation (${localFormations?.length || 0})`}
        nativeSelectProps={{
          onChange: (event) => setPickedFormationId(event.target.value),
        }}
        disabled={!isSuccess || !localFormations?.length}
        options={
          (localFormations?.length &&
            localFormations.map((formation) => ({
              value: formation.id,
              label: `${formation.intituleLong}`,
            }))) ||
          []
        }
      />
    </div>
  );
};

export default ModerationFormationPicker;
