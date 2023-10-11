import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Input,
  Stack,
  InputGroup,
  InputRightElement,
  Select,
  Grid,
  GridItem,
  Checkbox,
  Link,
  Tooltip,
} from "@chakra-ui/react";
import { SearchIcon, CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { DIPLOME_TYPE_MATCHER } from "../../constants";
import Line from "../../assets/icons/Line.svg";

const sortingOptions = [
  { label: "Formation (A-Z)", value: { id: "intitule_long", desc: false } },
  { label: "Formation (Z-A)", value: { id: "intitule_long", desc: true } },
  { label: "Localité (A-Z)", value: { id: "localite", desc: false } },
  { label: "Localité (Z-A)", value: { id: "localite", desc: true } },
];

// needed for this issue https://github.com/chakra-ui/chakra-ui/issues/1589
// eslint-disable-next-line no-unused-vars
const CheckboxIcon = ({ isChecked, isIndeterminate, as, ...rest }) => {
  return as;
};

const CreateCampagneTable = ({
  diplomeType,
  formations,
  allDiplomesSelectedFormations,
  setAllDiplomesSelectedFormations,
  existingFormationCatalogueIds,
}) => {
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState([]);
  const [displayedFormations, setDisplayedFormations] = useState([]);
  const [selectedFormations, setSelectedFormations] = useState([]);

  useEffect(() => {
    if (allDiplomesSelectedFormations.length) {
      setSelectedFormations(
        formations
          .map((formation) => formation._id)
          .filter(
            (formationId) =>
              allDiplomesSelectedFormations?.includes(formationId) &&
              !existingFormationCatalogueIds?.includes(formationId)
          )
      );
    }
  }, [allDiplomesSelectedFormations]);

  useEffect(() => {
    if (!displayedFormations.length && formations.length) {
      setDisplayedFormations(formations);
    }
  }, [formations]);

  useEffect(() => {
    if (sorting.length) {
      const sortedFormations = [...displayedFormations].sort(compareObjects);
      setDisplayedFormations(sortedFormations);
    }
  }, [sorting]);

  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase();
    setSearch(event.target.value);
    const filteredCFormations = formations.filter((formation) => {
      return (
        formation.intitule_long.toLowerCase().includes(search) ||
        formation.localite.toLowerCase().includes(search) ||
        formation.tags.join("-").toLowerCase().includes(search)
      );
    });
    setDisplayedFormations(filteredCFormations);
  };

  const compareObjects = (obj1, obj2) => {
    const { id, desc } = sorting[0];
    let value1 = obj1[id];
    let value2 = obj2[id];

    if (desc) {
      [value1, value2] = [value2, value1];
    }

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };

  const allCheckedIcon =
    selectedFormations.length !== displayedFormations.length && selectedFormations.length ? (
      <Image src={Line} alt="" />
    ) : (
      <CheckIcon boxSize="12px" />
    );

  return (
    <AccordionItem
      sx={{
        border: "1px solid #CACAFB",
        borderRadius: "12px",
        margin: "15px 0",
      }}
    >
      <h2>
        <AccordionButton
          _hover={{
            backgroundColor: "transparent",
          }}
        >
          <Box
            display="flex"
            textAlign="left"
            flexDirection="row"
            alignItems="center"
            w="100%"
            my="15px"
          >
            <Text fontSize="xl" color="brand.blue.700" fontWeight="600">
              {DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}
            </Text>
            <Text mx="10px">|</Text>
            <Text color="brand.blue.700">
              {selectedFormations.length}/{formations.length} formation
              {selectedFormations.length > 1 ? "s" : ""} sélectionnée
              {selectedFormations.length > 1 ? "s" : ""}
            </Text>
          </Box>
          <AccordionIcon color="brand.blue.700" fontSize="34px" />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} px="0" overflowX="auto">
        <Stack direction="column" mx="15px">
          <Stack direction="row" mt="32px" mb="20px">
            <Checkbox
              id="selectAll"
              size="lg"
              borderColor="brand.blue.400"
              isChecked={selectedFormations.length}
              mr="20px"
              icon={<CheckboxIcon as={allCheckedIcon} />}
              _checked={{
                "& .chakra-checkbox__control": { backgroundColor: "brand.blue.700" },
              }}
              _hover={{
                "& .chakra-checkbox__control": {
                  backgroundColor: selectedFormations.length ? "brand.blue.700" : "transparent",
                },
              }}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedFormations(
                    formations
                      .map((formation) => formation._id)
                      .filter(
                        (formationId) => !existingFormationCatalogueIds?.includes(formationId)
                      )
                  );
                  setAllDiplomesSelectedFormations((prevValue) => [
                    ...new Set([
                      ...prevValue,
                      ...formations
                        .map((formation) => formation._id)
                        .filter(
                          (formationId) => !existingFormationCatalogueIds?.includes(formationId)
                        ),
                    ]),
                  ]);
                } else {
                  setSelectedFormations([]);
                  setAllDiplomesSelectedFormations((prevValue) => {
                    const filtered = prevValue.filter(
                      (id) => !formations.map((formation) => formation._id).includes(id)
                    );
                    return filtered;
                  });
                }
              }}
            >
              <Text fontSize="16px" color="brand.black.500">
                {selectedFormations.length
                  ? `${selectedFormations.length} formation${
                      selectedFormations.length > 1 ? "s" : ""
                    } sélectionnée${selectedFormations.length > 1 ? "s" : ""}`
                  : "Tout sélectionner"}
              </Text>
            </Checkbox>
            <InputGroup w="325px">
              <Input
                id="search"
                name="search"
                type="text"
                placeholder="Rechercher une formation"
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
            <Select
              id="sorting"
              name="sorting"
              variant="outline"
              size="lg"
              placeholder="Trier AZ"
              borderColor="brand.blue.400"
              onChange={(event) =>
                setSorting(event.target.value ? [JSON.parse(event.target.value)] : [])
              }
              value={JSON.stringify(sorting[0])}
              w="325px"
            >
              {sortingOptions.map((option) => (
                <option key={option.label} value={JSON.stringify(option.value)}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Stack>
        </Stack>
        <Grid templateColumns="repeat(4, 1fr)" mx="55px">
          {displayedFormations.map((formation, index) => (
            <Tooltip
              key={formation.cle_ministere_educatif}
              isDisabled={!existingFormationCatalogueIds?.includes(formation._id)}
              label="Cette formation est déjà liée à une campagne. Vous ne pouvez pas la sélectionner."
            >
              <GridItem
                fontSize="14px"
                borderBottom={index < displayedFormations.length - 3 ? "1px solid #CACAFB" : "none"}
                py="12px"
              >
                <Stack direction="row">
                  <Checkbox
                    id={formation.id}
                    disabled={existingFormationCatalogueIds?.includes(formation._id)}
                    size="lg"
                    pr="8px"
                    borderColor="brand.blue.400"
                    isChecked={selectedFormations.includes(formation.id)}
                    _checked={{
                      "& .chakra-checkbox__control": { backgroundColor: "brand.blue.700" },
                    }}
                    _hover={{
                      "& .chakra-checkbox__control": {
                        backgroundColor: selectedFormations.includes(formation.id)
                          ? "brand.blue.700"
                          : existingFormationCatalogueIds?.includes(formation._id)
                          ? "gray.100"
                          : "transparent",
                      },
                    }}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFormations([...selectedFormations, formation.id]);
                        setAllDiplomesSelectedFormations((prev) => [...prev, formation.id]);
                      } else {
                        setSelectedFormations(
                          selectedFormations.filter((id) => id !== formation.id)
                        );
                        setAllDiplomesSelectedFormations((prev) =>
                          prev.filter((id) => id !== formation.id)
                        );
                      }
                    }}
                  />
                  <Stack
                    spacing={0}
                    disabled={true}
                    color={
                      existingFormationCatalogueIds?.includes(formation._id)
                        ? "gray.400"
                        : "initial"
                    }
                  >
                    <Text fontWeight="600" mb="4px">
                      {formation.intitule_long}
                    </Text>
                    <Text mb="4px">{formation.localite}</Text>
                    <Text mb="4px">{formation.tags?.join("-")}</Text>
                    <Link
                      href={`https://catalogue-apprentissage.intercariforef.org/formation/${formation.id}`}
                      target="_blank"
                      display="flex"
                      alignItems="center"
                      color={
                        existingFormationCatalogueIds?.includes(formation._id)
                          ? "gray.400"
                          : "brand.blue.700"
                      }
                    >
                      <ExternalLinkIcon
                        mr="5px"
                        color={
                          existingFormationCatalogueIds?.includes(formation._id)
                            ? "gray.400"
                            : "brand.blue.700"
                        }
                      />
                      Voir détail formation (CARIF OREF)
                    </Link>
                  </Stack>
                </Stack>
              </GridItem>
            </Tooltip>
          ))}
        </Grid>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default CreateCampagneTable;
