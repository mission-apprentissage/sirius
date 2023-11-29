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
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  TriangleDownIcon,
  TriangleUpIcon,
  SearchIcon,
  DownloadIcon,
  CheckIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { sortingOptions } from "../ManageCampagnes";
import CkDownload from "../../assets/icons/CkDownload.svg";
import IoInformationCircleOutline from "../../assets/icons/IoInformationCircleOutline.svg";
import Button from "../../Components/Form/Button";
import { simpleEditionSubmitHandler } from "../submitHandlers";
import CellInput from "./CellInput";
import CellInputSeats from "./CellInputSeats";
import { DIPLOME_TYPE_MATCHER } from "../../constants";
import { _get } from "../../utils/httpClient";
import Line from "../../assets/icons/Line.svg";
import DeleteCampagneConfirmationModal from "./DeleteCampagneConfirmationModal";

// needed for this issue https://github.com/chakra-ui/chakra-ui/issues/1589
// eslint-disable-next-line no-unused-vars
const CheckboxIcon = ({ isChecked, isIndeterminate, as, ...rest }) => {
  return as;
};

const columnHelper = createColumnHelper();

const getColumns = (
  handleCellUpdate,
  userContext,
  selectedCampagnes,
  setSelectedCampagnes,
  displayedCampagnes
) => [
  columnHelper.accessor("_id", {
    cell: (info) => (
      <Checkbox
        size="lg"
        pr="8px"
        borderColor="brand.blue.400"
        _checked={{
          "& .chakra-checkbox__control": { backgroundColor: "brand.blue.700" },
        }}
        onChange={() =>
          setSelectedCampagnes((prevValue) =>
            prevValue.includes(info.getValue())
              ? prevValue.filter((id) => id !== info.getValue())
              : [...prevValue, info.getValue()]
          )
        }
        isChecked={selectedCampagnes.includes(info.getValue())}
        _hover={{
          "& .chakra-checkbox__control": {
            backgroundColor: selectedCampagnes.includes(info.getValue())
              ? "brand.blue.700"
              : "transparent",
          },
        }}
      />
    ),
    header: () => {
      const allCheckedIcon =
        selectedCampagnes.length !== displayedCampagnes.length && selectedCampagnes.length ? (
          <Image src={Line} alt="" />
        ) : (
          <CheckIcon boxSize="12px" />
        );
      return (
        <Checkbox
          id="selectAll"
          size="lg"
          borderColor="brand.blue.400"
          isChecked={selectedCampagnes.length}
          mr="20px"
          icon={<CheckboxIcon as={allCheckedIcon} />}
          _checked={{
            "& .chakra-checkbox__control": { backgroundColor: "brand.blue.700" },
          }}
          _hover={{
            "& .chakra-checkbox__control": {
              backgroundColor: selectedCampagnes.length ? "brand.blue.700" : "transparent",
            },
          }}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCampagnes(displayedCampagnes.map((campagne) => campagne._id));
            } else {
              setSelectedCampagnes([]);
            }
          }}
        />
      );
    },
    enableSorting: false,
  }),
  columnHelper.accessor(
    (row) => [
      row.formation.data.intitule_long,
      row.formation.data.localite,
      row.formation.data.duree,
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
            {info.getValue()[2] && parseInt(info.getValue()[2]) && (
              <Text>
                En {info.getValue()[2]} an{parseInt(info.getValue()[2]) > 1 && "s"}
              </Text>
            )}
            <Text color="brand.black.500" textAlign="left">
              {info.getValue()[3].join("-")}
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
      <CellInputSeats id="seats" name="seats" info={info} handleCellUpdate={handleCellUpdate} />
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
  columnHelper.accessor((row) => [row._id, row.nomCampagne, row.formation.data.intitule_long], {
    cell: (info) => (
      <IconButton
        bgColor="transparent"
        aria-label="share"
        onClick={async () => {
          const response = await _get(
            `/api/campagnes/export/${info.getValue()[0]}`,
            userContext.token
          );

          const base64Data = `data:application/pdf;base64,${response.data}`;

          const a = document.createElement("a");
          a.href = base64Data;
          a.download = response.fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(base64Data);
        }}
        icon={<Image src={CkDownload} alt="Partage" />}
      />
    ),
    header: "Partage",
    meta: {
      isNumeric: true,
    },
  }),
];

const ManageCampagneTable = ({
  diplomeType,
  campagnes = [],
  formations,
  setShouldRefreshData,
  userContext,
}) => {
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState([]);
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [selectedCampagnes, setSelectedCampagnes] = useState([]);

  const {
    isOpen: isOpenDeleteConfirmation,
    onOpen: onOpenDeleteConfirmation,
    onClose: onCloseDeleteConfirmation,
  } = useDisclosure();

  useEffect(() => {
    setDisplayedCampagnes(campagnes);
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
    setShouldRefreshData(true);
    return updatedCampagne;
  };

  const table = useReactTable({
    columns: getColumns(
      handleCellUpdate,
      userContext,
      selectedCampagnes,
      setSelectedCampagnes,
      displayedCampagnes
    ),
    data: displayedCampagnes,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsLoadingDownload(true);
    const campagneIds = campagnes.map((campagne) => campagne._id);

    const response = await _get(`/api/campagnes/multiexport?ids=${campagneIds}`, userContext.token);

    const base64Data = `data:application/pdf;base64,${response.data}`;

    const a = document.createElement("a");
    a.href = base64Data;
    a.download = response.fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(base64Data);
    setIsLoadingDownload(false);
  };

  return (
    <>
      <AccordionItem
        sx={{
          border: "1px solid #CACAFB",
          borderRadius: "12px",
          margin: "15px 0",
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          w="100%"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            width={{ sm: "100%", md: "45%" }}
          >
            <AccordionButton
              _hover={{
                backgroundColor: "transparent",
              }}
            >
              <Box
                display="flex"
                textAlign="left"
                flexDirection="column"
                alignItems="flex-start"
                my="15px"
              >
                <Text fontSize="xl" color="brand.blue.700" fontWeight="600">
                  {DIPLOME_TYPE_MATCHER[diplomeType] || diplomeType}
                </Text>
                <Text color="brand.blue.700" fontSize="sm">
                  {campagnes?.length}
                  {formations?.length && `/${formations.length}`} campagne
                  {campagnes?.length > 1 ? "s" : ""} créée
                  {campagnes?.length > 1 ? "s" : ""}
                </Text>
              </Box>
            </AccordionButton>
          </Box>
          <Box display="flex" justifyContent="flex-end" width={{ sm: "100%", md: "55%" }}>
            <Box display="flex" flexWrap="wrap" justifyContent="flex-end">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                my="7px"
                mr="8px"
                width={{ base: "100%", md: "auto" }}
              >
                <Button
                  leftIcon={<DeleteIcon />}
                  variant="filled"
                  ml="15px"
                  size="md"
                  isDisabled={!selectedCampagnes.length}
                  _hover={{
                    backgroundColor: "brand.blue.700",
                  }}
                  onClick={onOpenDeleteConfirmation}
                >
                  {selectedCampagnes.length === 1
                    ? "Supprimer la campagne"
                    : `Supprimer les ${
                        selectedCampagnes.length > 0 ? selectedCampagnes.length : ""
                      } campagnes`}
                </Button>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                my="7px"
                mr="16px"
                width={{ base: "100%", md: "auto" }}
              >
                <Button
                  onClick={handleDownload}
                  leftIcon={<DownloadIcon />}
                  variant="filled"
                  ml="15px"
                  size="md"
                  isLoading={isLoadingDownload}
                  _hover={{
                    backgroundColor: "brand.blue.700",
                  }}
                >
                  Télécharger les supports de partage
                </Button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
              <AccordionButton
                _hover={{
                  backgroundColor: "transparent",
                }}
              >
                <AccordionIcon color="brand.blue.700" fontSize="34px" />
              </AccordionButton>
            </Box>
          </Box>
        </Box>
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
      <DeleteCampagneConfirmationModal
        isOpen={isOpenDeleteConfirmation}
        onClose={onCloseDeleteConfirmation}
        selectedCampagnes={selectedCampagnes}
        setSelectedCampagnes={setSelectedCampagnes}
        setShouldRefreshData={setShouldRefreshData}
      />
    </>
  );
};

export default ManageCampagneTable;
