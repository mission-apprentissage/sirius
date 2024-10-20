import { Select } from "chakra-react-select";
import { useState } from "react";

import { USER_ROLES, USER_STATUS } from "../../../constants";

const filterOptions = [
  {
    label: "Email confirmé",
    value: "emailConfirmedTrue",
  },
  {
    label: "Email non confirmé",
    value: "emailConfirmedFalse",
  },
  {
    label: "Active",
    value: "activeStatus",
  },
  {
    label: "Pending",
    value: "pendingStatus",
  },
  {
    label: "Inactive",
    value: "inactiveStatus",
  },
  {
    label: "Admin",
    value: "adminRole",
  },
  {
    label: "Etablissement",
    value: "etablissementRole",
  },
  {
    label: "Autres Role",
    value: "observerRole",
  },
];

const UsersTableFilters = ({ setDisplayedUsers, users, setSearch }) => {
  const [selectedFilters, setSelectedFilters] = useState([...filterOptions]);

  const handleFilter = (selectedFilters) => {
    let filteredUsers = [...users];

    const isFilterSelected = (filterValue) => selectedFilters.some((filter) => filter.value === filterValue);

    if (!isFilterSelected("emailConfirmedTrue")) {
      filteredUsers = filteredUsers.filter((user) => user.emailConfirmed !== true);
    }
    if (!isFilterSelected("emailConfirmedFalse")) {
      filteredUsers = filteredUsers.filter((user) => user.emailConfirmed !== false);
    }
    if (!isFilterSelected("activeStatus")) {
      filteredUsers = filteredUsers.filter((user) => user.status !== USER_STATUS.ACTIVE);
    }
    if (!isFilterSelected("pendingStatus")) {
      filteredUsers = filteredUsers.filter((user) => user.status !== USER_STATUS.PENDING);
    }
    if (!isFilterSelected("inactiveStatus")) {
      filteredUsers = filteredUsers.filter((user) => user.status !== USER_STATUS.INACTIVE);
    }
    if (!isFilterSelected("adminRole")) {
      filteredUsers = filteredUsers.filter((user) => user.role !== USER_ROLES.ADMIN);
    }
    if (!isFilterSelected("etablissementRole")) {
      filteredUsers = filteredUsers.filter((user) => user.role !== USER_ROLES.ETABLISSEMENT);
    }
    if (!isFilterSelected("observerRole")) {
      filteredUsers = filteredUsers.filter((user) => user.role !== USER_ROLES.OBSERVER);
    }

    setSelectedFilters(selectedFilters);
    setDisplayedUsers(filteredUsers);
    setSearch("");
  };

  return (
    <Select
      value={selectedFilters}
      isMulti
      name="colors"
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

export default UsersTableFilters;
