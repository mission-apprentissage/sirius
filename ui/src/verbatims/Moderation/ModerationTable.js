import React, { useState, useContext } from "react";
import {
  Tooltip,
  Select,
  useToast,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  VStack,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import parse from "html-react-parser";
import { VERBATIM_STATUS } from "../../constants";
import { _patch } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";

const columnHelper = createColumnHelper();

const getColumns = (handleVerbatimStatusChange) => [
  columnHelper.accessor("value", {
    cell: (info) => {
      const content = info.getValue().content || info.getValue();
      return <p>{content}</p>;
    },
    header: "Verbatim",
  }),
  columnHelper.accessor((row) => [row.value, row.key, row.temoignageId], {
    cell: (info) => {
      const value = info.getValue()[0];
      const questionId = info.getValue()[1];
      const temoignageId = info.getValue()[2];

      return (
        <Select
          size="sm"
          onChange={(e) =>
            handleVerbatimStatusChange(e, value?.content || value, questionId, temoignageId)
          }
          defaultValue={VERBATIM_STATUS[value?.status]}
          minW="150px"
        >
          {Object.keys(VERBATIM_STATUS).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
      );
    },
    header: "Status",
  }),
  columnHelper.accessor((row) => [row.etablissement, row.formation], {
    cell: (info) => (
      <VStack>
        <p>{info.getValue()[0]}</p>
        <p>{info.getValue()[1]}</p>
      </VStack>
    ),
    header: "Établissement et Formation",
  }),
  columnHelper.accessor("title", {
    cell: (info) => <p>{parse(info.getValue())}</p>,
    header: "Question",
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => (
      <Tooltip
        label={new Date(info.getValue()).toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}
        hasArrow
        arrowSize={15}
      >
        {new Date(info.getValue()).toLocaleDateString("fr-FR")}
      </Tooltip>
    ),
    header: "Crée le",
  }),
];

const ModerationTable = ({ verbatims = [] }) => {
  const [sorting, setSorting] = useState([]);
  const toast = useToast();
  const [userContext] = useContext(UserContext);

  const handleVerbatimStatusChange = async (e, verbatim, questionId, temoignageId) => {
    const status = e.target.value;
    const payload = {
      status,
      content: verbatim,
    };

    const response = await _patch(
      `/api/verbatims/${temoignageId}`,
      {
        questionId,
        payload,
      },
      userContext.token
    );
    if (response.acknowledged) {
      toast({
        title: "Statut du verbatim mis à jour",
        description: `Le statut du verbatim a été mis à jour avec succès`,
        status: "success",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erreur lors de la mise à jour du statut du verbatim",
        status: "error",
        duration: 3000,
      });
    }
  };

  const table = useReactTable({
    columns: getColumns(handleVerbatimStatusChange),
    data: verbatims,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
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
          <Tr key={row.createdAt}>
            {row.getVisibleCells().map((cell) => {
              return (
                <Td
                  key={cell.id}
                  px="15px"
                  fontSize="14px"
                  borderColor={
                    index === table.getRowModel().rows.length - 1 ? "transparent" : "brand.blue.400"
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
  );
};

export default ModerationTable;
