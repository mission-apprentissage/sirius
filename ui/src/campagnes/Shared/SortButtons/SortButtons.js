import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useEffect, useState } from "react";

import { campagneDisplayModeRegionObserver, campagnesDisplayMode, OBSERVER_SCOPES } from "../../../constants";
import { isPlural } from "../../utils";
import { SearchContainer, SortButtonsContainer } from "./sortButtons.style";

const SortButtons = ({
  displayMode,
  setDisplayMode,
  search,
  setSearch,
  searchResultCount,
  setIsOpened = () => {},
  organizeLabel,
  userScope,
}) => {
  const [inputValue, setInputValue] = useState(search);
  const isRegionObserver = userScope?.field === OBSERVER_SCOPES.REGION;

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
        options={isRegionObserver ? campagneDisplayModeRegionObserver : campagnesDisplayMode}
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
