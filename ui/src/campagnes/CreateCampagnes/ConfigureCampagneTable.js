import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Text,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Image,
  Tooltip,
  Input,
  Stack,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { SearchIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { DIPLOME_TYPE_MATCHER } from "../../constants";
import { sortingOptions } from "../ManageCampagnesPage";
import IoInformationCircleOutline from "../../assets/icons/IoInformationCircleOutline.svg";
import { formateDateToInputFormat } from "../utils";
import FiEdit from "../../assets/icons/FiEdit.svg";
import InputConfigure from "./InputConfigure";

const columnHelper = createColumnHelper();

const renderNomCampagneCell = (info, formik, data, setData, formationId) => {
  const cellContent = useMemo(() => {
    return (
      <InputConfigure
        id={`${formationId}.nomCampagne`}
        name={`${formationId}.nomCampagne`}
        info={info}
        type="text"
        placeholder="Nommer (facultatif)"
        rightElement={<Image src={FiEdit} alt="Édition" w="20px" />}
        rightElementProps={{ width: "20px", marginRight: "10px" }}
        style={{ paddingLeft: "10px" }}
        onBlur={() => formik.setFieldValue(`${formationId}.nomCampagne`, data)}
        onChange={(value) => setData(value)}
        value={data}
        size="md"
        _placeholder={{ color: "gray.600" }}
      />
    );
  }, [info, formik.values[formationId]?.nomCampagne, data]);

  return cellContent;
};

const renderStartDateCell = (info, formik, data, setData, formationId) => {
  const cellContent = useMemo(() => {
    return (
      <InputConfigure
        id={`${formationId}.startDate`}
        name={`${formationId}.startDate`}
        type="date"
        onBlur={() => formik.setFieldValue(`${formationId}.startDate`, data)}
        onChange={(value) => setData(value)}
        value={data}
        style={{ width: "80%", paddingRight: "10px" }}
        size="md"
        _placeholder={{ color: "gray.600" }}
      />
    );
  }, [info, formik.values[formationId]?.startDate, data]);

  return cellContent;
};

const renderEndDateCell = (info, formik, data, setData, formationId) => {
  const cellContent = useMemo(() => {
    return (
      <InputConfigure
        id={`${formationId}.endDate`}
        name={`${formationId}.endDate`}
        type="date"
        onBlur={() => formik.setFieldValue(`${formationId}.endDate`, data)}
        onChange={(value) => setData(value)}
        value={data}
        style={{ width: "80%", paddingRight: "10px" }}
        size="md"
        _placeholder={{ color: "gray.600" }}
        min={formik.values[formationId]?.startDate || formateDateToInputFormat(new Date())}
      />
    );
  }, [info, formik.values[formationId]?.endDate, data]);

  return cellContent;
};

const renderSeatsCell = (info, formik, data, setData, formationId) => {
  const cellContent = useMemo(() => {
    return (
      <InputConfigure
        id={`${formationId}.seats`}
        name={`${formationId}.seats`}
        type="number"
        subType="seats"
        onBlur={() => formik.setFieldValue(`${formationId}.seats`, Number(data))}
        onChange={(value) => setData(value)}
        value={data}
        style={{ width: "80%" }}
        size="md"
        placeholder="Illimité"
        _placeholder={{ color: "brand.black.500" }}
        min={0}
      />
    );
  }, [info, formik.values[formationId]?.seats, data]);

  return cellContent;
};

const getColumns = (formik) => [
  columnHelper.accessor((row) => [row.intitule_long, row.localite, row.duree, row.tags], {
    cell: (info) => {
      return (
        <Box display="flex" flexDirection="column">
          <Text color="brand.black.500" fontWeight="600" textAlign="left">
            {info.getValue()[0]}
          </Text>
          <Text color="brand.black.500" textAlign="left">
            {info.getValue()[1]}
          </Text>
          {info.getValue()[2] && parseInt(info.getValue()[2]) && (
            <Text color="brand.black.500" textAlign="left">
              En {info.getValue()[2]} an{parseInt(info.getValue()[2]) > 1 && "s"}
            </Text>
          )}
          <Text color="brand.black.500" textAlign="left" mb="4px">
            {info.getValue()[3].join("-")}
          </Text>
        </Box>
      );
    },
    header: "Formation",
  }),
  columnHelper.accessor(() => "", {
    id: "nomCampagne",
    cell: (info) => {
      const formationId = info.row.original._id;
      const [data, setData] = useState(formik.values[formationId]?.nomCampagne || "");

      return renderNomCampagneCell(info, formik, data, setData, formationId);
    },

    header: () => (
      <Box display="flex" flexDirection="row" justifyContent="flex-start" w="100%">
        <Text mr="3px">Nom d'usage formation</Text>
        <Tooltip
          label={
            <Text>
              <strong>Dénomination qui sera visible par les apprenti·es.</strong> Ex : BTS
              Négociation et digitalisation de la relation client → BTS NDRC
            </Text>
          }
        >
          <Image src={IoInformationCircleOutline} />
        </Tooltip>
      </Box>
    ),
  }),

  columnHelper.accessor(() => formateDateToInputFormat(new Date()), {
    id: "startDate",
    cell: (info) => {
      const formationId = info.row.original._id;

      const [data, setData] = useState(
        formik.values[formationId]?.startDate || info.getValue() || ""
      );

      return renderStartDateCell(info, formik, data, setData, formationId);
    },
    header: "Début campagne",
  }),
  columnHelper.accessor(() => formateDateToInputFormat(new Date(), 1), {
    id: "endDate",
    cell: (info) => {
      const formationId = info.row.original._id;

      const [data, setData] = useState(
        formik.values[formationId]?.endDate || info.getValue() || ""
      );

      return renderEndDateCell(info, formik, data, setData, formationId);
    },
    header: "Fin campagne",
  }),
  columnHelper.accessor(() => 0, {
    id: "seats",
    cell: (info) => {
      const formationId = info.row.original._id;

      const [data, setData] = useState(formik.values[formationId]?.seats || info.getValue() || "");

      return renderSeatsCell(info, formik, data, setData, formationId);
    },
    header: (
      <Box display="flex" flexDirection="row" justifyContent="flex-start" w="100%">
        <Text mr="3px">Apprenti·es</Text>
        <Tooltip
          label={
            <Text>Jeunes inscrits dans la formation au moment de la création de la campagne</Text>
          }
        >
          <Image src={IoInformationCircleOutline} />
        </Tooltip>
      </Box>
    ),
    meta: {
      isNumeric: true,
    },
  }),
];

const ConfigureCampagneTable = ({
  diplomeType,
  formations,
  allDiplomesSelectedFormations,
  existingFormationCatalogueIds,
  formik,
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

  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase();
    setSearch(event.target.value);
    const filteredCampagnes = formations.filter((formation) => {
      return (
        formation.intitule_long.toLowerCase().includes(search) ||
        formation.localite.toLowerCase().includes(search) ||
        formation.tags.join("-").toLowerCase().includes(search)
      );
    });
    setDisplayedFormations(filteredCampagnes);
  };

  const table = useReactTable({
    columns: getColumns(formik),
    data: formations,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

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
              {selectedFormations.length}/{formations.length} campagne
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
        <form onSubmit={formik.handleSubmit}>
          <Table>
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta;
                    return (
                      <Th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        isNumeric={meta?.isNumeric}
                        color="brand.blue.700"
                        textTransform="none"
                        fontSize="14px"
                        fontWeight="400"
                        borderColor="brand.blue.400"
                        px="15px"
                      >
                        <Box display="flex" w="calc(100% + 16px)">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <chakra.span pl="4px">
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === "desc" ? (
                                <TriangleDownIcon aria-label="sorted descending" />
                              ) : (
                                <TriangleUpIcon aria-label="sorted ascending" />
                              )
                            ) : null}
                          </chakra.span>
                        </Box>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row, index) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          px="15px"
                          fontSize="14px"
                          borderColor={
                            index === table.getRowModel().rows.length - 1
                              ? "transparent"
                              : "brand.blue.400"
                          }
                        >
                          <Box display="flex" maxW="300px">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Box>
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </form>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ConfigureCampagneTable;
