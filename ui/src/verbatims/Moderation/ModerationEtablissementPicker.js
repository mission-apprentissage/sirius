import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useEffect, useState } from "react";

import useFetchLocalEtablissements from "../../hooks/useFetchLocalEtablissements";
import { etablissementLabelGetter } from "../../utils/etablissement";

const ModerationEtablissementPicker = ({ setPickedEtablissement }) => {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState(search);

  const { localEtablissements, isSuccess, isError } = useFetchLocalEtablissements({
    search,
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
        title="Une erreur s'est produite dans la récupération des établissements"
        description="Merci de réessayer ultérieurement"
        severity="error"
      />
    );
  }

  return (
    <div>
      <Input
        label="Rechercher un établissement"
        disabled={!isSuccess || (!localEtablissements?.length && !search)}
        nativeInputProps={{
          value: inputValue,
          placeholder: "Par SIRET ou nom",
          onChange: (e) => setInputValue(e.target.value),
        }}
      />
      <Select
        label={`Choix de l'établissement (${localEtablissements?.length || 0})`}
        nativeSelectProps={{
          onChange: (event) =>
            setPickedEtablissement(
              localEtablissements.find((etablissement) => etablissement.siret === event.target.value)
            ),
        }}
        disabled={!isSuccess || !localEtablissements?.length}
        options={
          (localEtablissements?.length &&
            localEtablissements.map((etablissement) => ({
              value: etablissement.siret,
              label: `${etablissementLabelGetter(etablissement)} - ${etablissement.localite}`,
            }))) ||
          []
        }
      />
    </div>
  );
};

export default ModerationEtablissementPicker;
