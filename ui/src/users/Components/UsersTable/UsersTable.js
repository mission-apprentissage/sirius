import React, { useState, useContext, useEffect } from "react";
import { Table, Tbody, Tr, Td, useDisclosure, Box, Stack, useClipboard } from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { UserContext } from "../../../context/UserContext";
import ChangeUserStatusConfirmationModal from "../ChangeUserStatusConfirmationModal";
import ChangeUserRoleConfirmationModal from "../ChangeUserRoleConfirmationModal";
import UsersTableFilters from "./UsersTableFilters";
import UsersTableSearch from "./UsersTableSearch";
import UsersTableHead from "./UsersTableHead";
import usersTableColumns from "./usersTableColumns";
import AddSiretModal from "../AddSiretModal";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users, setRefetchData }) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const navigate = useNavigate();
  const { onCopy: onCopyClipBoard, setValue: setClipboardValue } = useClipboard("");

  useEffect(() => {
    setDisplayedUsers(users);
  }, [users]);

  const {
    isOpen: isOpenStatusConfirmation,
    onOpen: onOpenStatusConfirmation,
    onClose: onCloseStatusConfirmation,
  } = useDisclosure();

  const {
    isOpen: isOpenRoleConfirmation,
    onOpen: onOpenRoleConfirmation,
    onClose: onCloseRoleConfirmation,
  } = useDisclosure();

  const {
    isOpen: isOpenAddSiret,
    onOpen: onOpenAddSiret,
    onClose: onCloseAddSiret,
  } = useDisclosure();

  const table = useReactTable({
    columns: usersTableColumns(
      userContext,
      setUserContext,
      setSelectedUser,
      setSelectedStatus,
      onOpenStatusConfirmation,
      setSelectedRole,
      onOpenRoleConfirmation,
      setClipboardValue,
      onCopyClipBoard,
      onOpenAddSiret,
      navigate
    ),
    data: displayedUsers,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <Stack direction="row" mt="32px" mb="20px" alignItems="center">
        <UsersTableSearch
          users={users}
          setDisplayedUsers={setDisplayedUsers}
          search={search}
          setSearch={setSearch}
        />
        <UsersTableFilters
          users={users}
          setDisplayedUsers={setDisplayedUsers}
          setSearch={setSearch}
        />
      </Stack>
      <Box width="100%" overflowX="auto">
        <Table>
          <UsersTableHead table={table} />
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
      </Box>
      <ChangeUserStatusConfirmationModal
        isOpen={isOpenStatusConfirmation}
        onClose={onCloseStatusConfirmation}
        user={selectedUser}
        selectedStatus={selectedStatus}
        setRefetchData={setRefetchData}
      />
      <ChangeUserRoleConfirmationModal
        isOpen={isOpenRoleConfirmation}
        onClose={onCloseRoleConfirmation}
        user={selectedUser}
        selectedRole={selectedRole}
        setRefetchData={setRefetchData}
      />
      <AddSiretModal
        isOpen={isOpenAddSiret}
        onClose={onCloseAddSiret}
        user={selectedUser}
        setRefetchData={setRefetchData}
      />
    </>
  );
};

export default UsersTable;
