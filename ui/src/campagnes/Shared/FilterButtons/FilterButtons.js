import { Input } from "@codegouvfr/react-dsfr/Input";
import React, { useEffect, useState } from "react";

import MultiSelect from "../../../Components/MultiSelect/MultiSelect";
import { SearchContainer } from "./FilterButtons.style";

const FilterButtons = ({
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
    if (!selectedEtablissementsSiret?.length && etablissementsOptions.length) {
      setSelectedEtablissementsSiret(etablissementsOptions.map((option) => option.value));
    }
  }, [selectedEtablissementsSiret, etablissementsOptions]);

  useEffect(() => {
    if (!selectedDiplomesIntitule?.length) {
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
            label="Établissements"
            name="etablissements"
            options={etablissementsOptions}
            placeholder="Sélectionner un établissement"
            selected={selectedEtablissementsSiret}
            setSelected={setSelectedEtablissementsSiret}
          />
          <MultiSelect
            label="Diplômes"
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

export default FilterButtons;
