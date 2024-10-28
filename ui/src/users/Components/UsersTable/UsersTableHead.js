import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, chakra, Th, Thead, Tr } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";

const UsersTableHead = ({ table }) => {
  return (
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
  );
};

export default UsersTableHead;
