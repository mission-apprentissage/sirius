import React from "react";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SortButtonsContainer } from "./sortButtons.style";
import { campagnesDisplayModeOptions, campagnesSortingOptions } from "../../../constants";

const SortButtons = ({
  displayMode,
  setDisplayMode,
  sortingMode = null,
  setSortingMode = null,
  search,
  setSearch,
  organizeLabel,
  mode,
}) => {
  return (
    <SortButtonsContainer>
      <Select
        label={organizeLabel}
        nativeSelectProps={{
          value: displayMode,
          onChange: (event) => setDisplayMode(event.target.value),
        }}
        options={campagnesDisplayModeOptions}
      />
      {mode === "manage" ||
        (mode === "results" && (
          <Select
            nativeSelectProps={{
              value: sortingMode,
              onChange: (event) => setSortingMode(event.target.value),
            }}
            options={campagnesSortingOptions}
          />
        ))}
      <Input
        nativeInputProps={{
          value: search,
          placeholder: "Rechercher",
          onChange: (e) => setSearch(e.target.value),
        }}
      />
    </SortButtonsContainer>
  );
};

export default SortButtons;
