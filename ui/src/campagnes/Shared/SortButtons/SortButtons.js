import React from "react";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SortButtonsContainer } from "./sortButtons.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../../constants";

const SortButtons = ({
  displayMode,
  setDisplayMode,
  sortingMode = null,
  setSortingMode = null,
  search,
  setSearch,
  setIsOpened,
  organizeLabel,
  mode,
}) => {
  return (
    <SortButtonsContainer>
      <Select
        label={organizeLabel}
        nativeSelectProps={{
          value: displayMode,
          onChange: (event) => {
            setDisplayMode(event.target.value);
            setIsOpened(true);
          },
        }}
        options={campagnesDisplayMode}
      />
      {mode === "manage" ||
        (mode === "results" && (
          <Select
            nativeSelectProps={{
              value: sortingMode,
              onChange: (event) => {
                setSortingMode(event.target.value);
                setIsOpened(true);
              },
            }}
            options={campagnesSortingOptions}
          />
        ))}
      <Input
        nativeInputProps={{
          value: search,
          placeholder: "Rechercher",
          onChange: (e) => {
            setSearch(e.target.value);
            setIsOpened(true);
          },
        }}
      />
    </SortButtonsContainer>
  );
};

export default SortButtons;
