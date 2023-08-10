import React, { useState, useContext } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Tooltip,
  Box,
  Select,
} from "@chakra-ui/react";
import { UserContext } from "../../context/UserContext";
import ChangeUserStatusConfirmationModal from "./ChangeUserStatusConfirmationModal";
import ChangeUserRoleConfirmationModal from "./ChangeUserRoleConfirmationModal";
import { USER_ROLES, USER_STATUS } from "../../constants";

const UsersTable = ({ users, setRefetchData }) => {
  const [userContext] = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

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

  return (
    <>
      <Box w="90%" m="25px auto">
        <TableContainer my={4} p={2} rounded="md" w="100%" boxShadow="md" bgColor="white">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Prénom</Th>
                <Th>Nom</Th>
                <Th>Email</Th>
                <Th>SIRET</Th>
                <Th>Établissement</Th>
                <Th>Commentaire</Th>
                <Th>Status</Th>
                <Th>Role</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => {
                return (
                  <Tr key={user._id}>
                    <Td>{user.firstName}</Td>
                    <Td>{user.lastName}</Td>
                    <Td>{user.username}</Td>
                    <Td>{user.siret}</Td>
                    <Td sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {(user.etablissement?.onisep_nom ||
                        user.etablissement?.enseigne ||
                        user.etablissement?.entreprise_raison_sociale) && (
                        <Tooltip
                          label={`${user.etablissement?.onisep_nom} - 
                          ${user.etablissement?.enseigne} -
                            ${user.etablissement?.entreprise_raison_sociale}`}
                          hasArrow
                          arrowSize={15}
                        >
                          {user.etablissement?.onisep_nom ||
                            user.etablissement?.enseigne ||
                            user.etablissement?.entreprise_raison_sociale}
                        </Tooltip>
                      )}
                    </Td>
                    <Td sx={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.comment && (
                        <Tooltip label={user.comment && user.comment} hasArrow arrowSize={15}>
                          {user.comment}
                        </Tooltip>
                      )}
                    </Td>
                    <Td minW="150px">
                      {user._id === userContext.currentUserId ? (
                        <Tooltip label="Vous ne pouvez pas modifier votre propre status" hasArrow>
                          <span>{USER_STATUS[user.status]}</span>
                        </Tooltip>
                      ) : (
                        <Select
                          size="xs"
                          onChange={(e) => {
                            setSelectedUser(user);
                            setSelectedStatus(e.target.value);
                            onOpenStatusConfirmation();
                          }}
                          defaultValue={USER_STATUS[user.status]}
                        >
                          {Object.keys(USER_STATUS).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Td>
                    <Td minW="150px">
                      {user._id === userContext.currentUserId ? (
                        <Tooltip label="Vous ne pouvez pas modifier votre propre role" hasArrow>
                          <span>{USER_ROLES[user.role]}</span>
                        </Tooltip>
                      ) : (
                        <Select
                          size="xs"
                          onChange={(e) => {
                            setSelectedUser(user);
                            setSelectedRole(e.target.value);
                            onOpenRoleConfirmation();
                          }}
                          defaultValue={USER_ROLES[user.role]}
                        >
                          {Object.keys(USER_ROLES).map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
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
    </>
  );
};

export default UsersTable;
