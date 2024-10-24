import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, chakra, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

const columnHelper = createColumnHelper();

const getColumns = [
  columnHelper.accessor("siret", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: "SIRET",
  }),
  columnHelper.accessor((row) => [row.onisepNom, row.enseigne, row.entrepriseRaisonSociale], {
    cell: (info) => <p>{info.getValue()[0] || info.getValue()[1] || info.getValue()[2]}</p>,
    header: "Label",
  }),
  columnHelper.accessor((row) => [row.regionImplantationNom], {
    cell: (info) => <p>{info.getValue()}</p>,
    header: "Région",
  }),
  columnHelper.accessor("campagnesCount", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: "Campagnes",
    sortingFn: (rowA, rowB, columnId, desc) => {
      const lengthA = rowA.getValue(columnId) ?? 0;
      const lengthB = rowB.getValue(columnId) ?? 0;

      if (lengthA > lengthB) {
        return desc ? -1 : 1;
      }
      if (lengthA < lengthB) {
        return desc ? 1 : -1;
      }
      return 0;
    },
  }),
  columnHelper.accessor("temoignagesCount", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: "Témoignages",
  }),
  columnHelper.accessor("verbatimsCount", {
    cell: (info) => <p>{info.getValue()}</p>,
    header: "Verbatims",
  }),
];

const SuiviEtablissementsTable = ({ etablissements = [] }) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    columns: getColumns,
    data: etablissements,
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
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <Td
                  key={cell.id}
                  px="15px"
                  fontSize="14px"
                  borderColor={index === table.getRowModel().rows.length - 1 ? "transparent" : "brand.blue.400"}
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

export default SuiviEtablissementsTable;
