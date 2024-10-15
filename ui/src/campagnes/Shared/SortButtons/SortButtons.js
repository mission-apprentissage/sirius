import React, { useState, useEffect } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { SearchContainer } from "./sortButtons.style";

const SortButtons = ({ search, setSearch, setIsOpened = () => {} }) => {
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
    <SearchContainer>
      <Input
        nativeInputProps={{
          value: inputValue,
          placeholder: "Rechercher",
          onChange: (e) => setInputValue(e.target.value),
        }}
      />
    </SearchContainer>
  );
};

export default SortButtons;
