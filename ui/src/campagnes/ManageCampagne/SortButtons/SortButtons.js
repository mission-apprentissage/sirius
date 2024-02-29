import React from "react";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SortButtonsContainer } from "./sortButtons.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../../constants";

const SortButtons = ({
  displayMode,
  setDisplayMode,
  sortingMode,
  setSortingMode,
  search,
  setSearch,
  organizeLabel,
}) => {
  return (
    <SortButtonsContainer>
      <Select
        label={organizeLabel}
        nativeSelectProps={{
          value: displayMode,
          onChange: (event) => setDisplayMode(event.target.value),
        }}
        options={campagnesDisplayMode}
      />
      <Select
        nativeSelectProps={{
          value: sortingMode,
          onChange: (event) => setSortingMode(event.target.value),
        }}
        options={campagnesSortingOptions}
      />
      <Input
        value={search}
        nativeInputProps={{
          placeholder: "Rechercher",
          onChange: (e) => setSearch(e.target.value),
        }}
      />
    </SortButtonsContainer>
  );
};

export default SortButtons;
