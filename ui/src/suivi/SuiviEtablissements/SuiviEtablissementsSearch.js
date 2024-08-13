import React from "react";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SuiviEtablissementsSearch = ({
  etablissements,
  setDisplayedEtablissements,
  search,
  setSearch,
}) => {
  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase();
    setSearch(event.target.value);

    if (!search) {
      setDisplayedEtablissements(etablissements);
      return;
    }
    const filteredEtablissements = etablissements.filter((etablissement) => {
      return (
        etablissement.enseigne?.toLowerCase().includes(search) ||
        etablissement.entreprise_raison_sociale?.toLowerCase().includes(search) ||
        etablissement.onisep_nom?.toLowerCase().includes(search) ||
        etablissement.siret?.toLowerCase().includes(search) ||
        etablissement.region_implantation_nom?.toLowerCase().includes(search)
      );
    });
    setDisplayedEtablissements(filteredEtablissements);
  };

  return (
    <InputGroup w="325px">
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="Rechercher un établissement"
        onChange={handleSearch}
        value={search}
        size="lg"
        color="brand.black.500"
        _placeholder={{ color: "brand.black.500", fontSize: "16px" }}
        borderColor="brand.blue.400"
        fontSize="16px"
      />
      <InputRightElement h="100%">
        <SearchIcon color="brand.black.500" />
      </InputRightElement>
    </InputGroup>
  );
};

export default SuiviEtablissementsSearch;
