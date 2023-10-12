import React, { useState, useEffect } from "react";
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
  IconButton,
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
import { TriangleDownIcon, TriangleUpIcon, SearchIcon, DownloadIcon } from "@chakra-ui/icons";
import { sortingOptions } from "../ManageCampagnes";
import CkDownload from "../../assets/icons/CkDownload.svg";
import IoInformationCircleOutline from "../../assets/icons/IoInformationCircleOutline.svg";
import Button from "../../Components/Form/Button";
import { simpleEditionSubmitHandler } from "../submitHandlers";
import CellInput from "./CellInput";
import { DIPLOME_TYPE_MATCHER } from "../../constants";

const columnHelper = createColumnHelper();

const getColumns = (handleCellUpdate) => [
  columnHelper.accessor(
    (row) => [
      row.formation.data.intitule_long,
      row.formation.data.localite,
      row.formation.data.tags,
    ],
    {
      cell: (info) => {
        return (
          <Box display="flex" flexDirection="column">
            <Text color="brand.black.500" fontWeight="600" textAlign="left">
              {info.getValue()[0]}
            </Text>
            <Text color="brand.black.500" textAlign="left">
              {info.getValue()[1]}
            </Text>
            <Text color="brand.black.500" textAlign="left">
              {info.getValue()[2].join("-")}
            </Text>
          </Box>
        );
      },
      header: "Formation",
    }
  ),
  columnHelper.accessor("nomCampagne", {
    cell: (info) => (
      <CellInput
        id="nomCampagne"
        name="nomCampagne"
        info={info}
        handleCellUpdate={handleCellUpdate}
        type="text"
      />
    ),
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
  columnHelper.accessor("startDate", {
    cell: (info) => (
      <CellInput
        id="startDate"
        name="startDate"
        info={info}
        handleCellUpdate={handleCellUpdate}
        type="date"
      />
    ),
    header: "Début",
  }),
  columnHelper.accessor("endDate", {
    cell: (info) => (
      <CellInput
        id="endDate"
        name="endDate"
        info={info}
        handleCellUpdate={handleCellUpdate}
        type="date"
      />
    ),
    header: "Fin",
  }),
  columnHelper.accessor("seats", {
    cell: (info) => (
      <CellInput
        id="seats"
        name="seats"
        info={info}
        handleCellUpdate={handleCellUpdate}
        type="number"
      />
    ),
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
  columnHelper.accessor(
    (row) =>
      row.seats > 0
        ? Math.round((row.temoignagesCount * 100) / row.seats) + "%"
        : row.temoignagesCount,
    {
      cell: (info) => info.getValue(),
      header: "Complétion",
      meta: {
        isNumeric: true,
      },
    }
  ),
  columnHelper.accessor((row) => row._id, {
    cell: (info) => (
      <IconButton
        bgColor="transparent"
        aria-label="share"
        onClick={() => console.log(info.getValue())}
        icon={<Image src={CkDownload} alt="Partage" />}
      />
    ),
    header: "Partage",
    meta: {
      isNumeric: true,
    },
  }),
];

const ManageCampagneTable = ({ diplomeType, campagnes, formations, userContext }) => {
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState([]);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);

  useEffect(() => {
    if (!displayedCampagnes.length && campagnes.length) {
      setDisplayedCampagnes(campagnes);
    }
  }, [campagnes]);

  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase();
    setSearch(event.target.value);
    const filteredCampagnes = campagnes.filter((campagne) => {
      return (
        campagne.formation.data.intitule_long.toLowerCase().includes(search) ||
        campagne.formation.data.localite.toLowerCase().includes(search) ||
        campagne.formation.data.tags.join("-").toLowerCase().includes(search) ||
        campagne.nomCampagne.toLowerCase().includes(search)
      );
    });
    setDisplayedCampagnes(filteredCampagnes);
  };

  const handleCellUpdate = async (campagneId, payload) => {
    const updatedCampagne = await simpleEditionSubmitHandler(campagneId, payload, userContext);
    return updatedCampagne;
  };

  const table = useReactTable({
    columns: getColumns(handleCellUpdate),
    data: displayedCampagnes,
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
            w="60%"
            my="15px"
          >
            <Text fontSize="xl" color="brand.blue.700" fontWeight="600">
              {DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}
            </Text>
            <Text mx="10px">|</Text>
            <Text color="brand.blue.700">
              {campagnes?.length}/{formations?.length} campagne{campagnes?.length > 1 ? "s" : ""}{" "}
              créée
              {campagnes?.length > 1 ? "s" : ""}
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            my="15px"
            mr="16px"
            w="40%"
          >
            <Button as="div" leftIcon={<DownloadIcon />} variant="filled" ml="auto" size="md">
              Télécharger les supports de partage
            </Button>
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
            {table.getRowModel().rows.map((row, index) => (
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
            ))}
          </Tbody>
        </Table>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ManageCampagneTable;
