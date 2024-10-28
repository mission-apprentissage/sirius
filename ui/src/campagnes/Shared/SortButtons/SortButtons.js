import { Input } from "@codegouvfr/react-dsfr/Input";
import React, { useEffect, useState } from "react";

import MultiSelect from "../../../Components/MultiSelect/MultiSelect";
import { SearchContainer } from "./sortButtons.style";

const SortButtons = ({
  search,
  setSearch,
  selectedEtablissementsSiret,
  setSelectedEtablissementsSiret,
  selectedDiplomesIntitule,
  setSelectedDiplomesIntitule,
  etablissementsOptions = [],
  diplomesOptions = [],
  showSelect = true,
  setIsOpened = () => {},
}) => {
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    if (search !== inputValue) {
      setInputValue(search);
    }
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
      if (inputValue) {
        setIsOpened(true);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, setSearch, setIsOpened]);

  useEffect(() => {
    if (!selectedEtablissementsSiret) {
      setSelectedEtablissementsSiret(etablissementsOptions.map((option) => option.value));
    }
  }, [selectedEtablissementsSiret, etablissementsOptions]);

  useEffect(() => {
    if (!selectedDiplomesIntitule) {
      setSelectedDiplomesIntitule(diplomesOptions.map((option) => option.value));
    }
  }, [diplomesOptions]);

  return (
    <SearchContainer>
      <Input
        nativeInputProps={{
          value: inputValue,
          placeholder: "Rechercher",
          onChange: (e) => setInputValue(e.target.value),
        }}
      />
      {showSelect ? (
        <>
          <MultiSelect
            name="etablissements"
            options={etablissementsOptions}
            placeholder="Sélectionner un établissement"
            selected={selectedEtablissementsSiret}
            setSelected={setSelectedEtablissementsSiret}
          />
          <MultiSelect
            name="diplomes"
            options={diplomesOptions}
            placeholder="Sélectionner un diplôme"
            selected={selectedDiplomesIntitule}
            setSelected={setSelectedDiplomesIntitule}
          />
        </>
      ) : null}
    </SearchContainer>
  );
};

export default SortButtons;
