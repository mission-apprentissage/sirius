import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

const ModerationFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState([...filterOptions]);

  useEffect(() => {
    if (searchParams.get("selectedStatus")) {
      const selectedStatus = searchParams.get("selectedStatus")?.split(",");
      const selectedFilters = filterOptions.filter((filter) =>
        selectedStatus.includes(filter.value)
      );
      setSelectedFilters(selectedFilters);
    }
  }, []);

  const handleFilter = (selectedFilters) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const selectedStatus = selectedFilters.map((filter) => filter);
    const selectedStatusValues = selectedStatus.map((status) => status.value).join(",");

    newSearchParams.set("selectedStatus", selectedStatusValues);
    newSearchParams.set("page", 1);

    setSelectedFilters(selectedFilters);
    setSearchParams(newSearchParams);
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
      onChange={(filters, action) => handleFilter(filters, action)}
    />
  );
};

export default ModerationFilters;
