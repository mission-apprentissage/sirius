import React, { useState, useEffect } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SortButtonsContainer, SearchContainer } from "./sortButtons.style";
import { isPlural } from "../../utils";

const SortButtons = ({ search, setSearch, searchResultCount, setIsOpened = () => {} }) => {
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
