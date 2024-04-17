import React, { useState, useEffect } from "react";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SortButtonsContainer, SearchContainer } from "./sortButtons.style";
import { campagnesDisplayMode } from "../../../constants";
import { isPlural } from "../../utils";

const SortButtons = ({
  displayMode,
  setDisplayMode,
  search,
  setSearch,
  searchResultCount,
  setIsOpened = () => {},
  organizeLabel,
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
      <SearchContainer>
        <Input
          nativeInputProps={{
            value: inputValue,
            placeholder: "Rechercher",
            onChange: (e) => setInputValue(e.target.value),
          }}
        />
        {searchResultCount ? (
          <p>
            {searchResultCount} campagne{isPlural(searchResultCount)} trouvée
            {isPlural(searchResultCount)}
          </p>
        ) : null}
      </SearchContainer>
    </SortButtonsContainer>
  );
};

export default SortButtons;
