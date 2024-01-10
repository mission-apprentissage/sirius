import React, { useState } from "react";
import { Select } from "chakra-react-select";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";

const filterOptions = [
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.PENDING],
    value: VERBATIM_STATUS.PENDING,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.VALIDATED],
    value: VERBATIM_STATUS.VALIDATED,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.TO_FIX],
    value: VERBATIM_STATUS.TO_FIX,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.ALERT],
    value: VERBATIM_STATUS.ALERT,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.REJECTED],
    value: VERBATIM_STATUS.REJECTED,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.GEM],
    value: VERBATIM_STATUS.GEM,
  },
];

const ModerationFilters = ({ setDisplayedVerbatims, verbatims }) => {
  const [selectedFilters, setSelectedFilters] = useState([...filterOptions]);

  const handleFilter = (selectedFilters) => {
    const filteredVerbatims = verbatims.filter((verbatim) =>
      selectedFilters.some((filter) => verbatim.value?.status === filter.value)
    );

    setSelectedFilters(selectedFilters);
    setDisplayedVerbatims(filteredVerbatims);
  };

  return (
    <Select
      value={selectedFilters}
      isMulti
      options={filterOptions}
      placeholder="Filtres"
      size="lg"
      isSearchable={false}
      chakraStyles={{
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: "brand.black.500",
        }),
        container: (baseStyles) => ({
          ...baseStyles,
          borderColor: "brand.blue.400",
        }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "brand.blue.500",
          color: "white",
        }),
      }}
      isClearable={false}
      onChange={handleFilter}
    />
  );
};

export default ModerationFilters;
