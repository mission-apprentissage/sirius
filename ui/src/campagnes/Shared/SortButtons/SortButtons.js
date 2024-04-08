import React, { useState, useEffect } from "react";
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
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
      setIsOpened(true);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, setSearch, setIsOpened]);

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
      {(mode === "manage" || mode === "results") && (
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
      )}
      <Input
        nativeInputProps={{
          value: inputValue,
          placeholder: "Rechercher",
          onChange: (e) => setInputValue(e.target.value),
        }}
      />
    </SortButtonsContainer>
  );
};

export default SortButtons;
