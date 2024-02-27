import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { SortButtonsContainer } from "./sortButtons.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../../../constants";

const SortButtons = ({ displayMode, setDisplayMode, sortingMode, setSortingMode, setSearch }) => {
  return (
    <SortButtonsContainer>
      <Select
        label="Organiser mes campagnes par"
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
      <SearchBar onButtonClick={(value) => setSearch(value)} />
    </SortButtonsContainer>
  );
};

export default SortButtons;
