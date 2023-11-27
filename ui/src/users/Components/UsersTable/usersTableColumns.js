import { Tooltip, Box, Select, Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { USER_ROLES, USER_STATUS } from "../../../constants";
import { etablissementLabelGetter } from "../../../utils/etablissement";

const columnHelper = createColumnHelper();

const usersTableColumns = (
  userContext,
  setSelectedUser,
  setSelectedStatus,
  onOpenStatusConfirmation,
  setSelectedRole,
  onOpenRoleConfirmation
) => [
  columnHelper.accessor("firstName", {
    cell: (info) => {
      return (
        <Box display="flex" flexDirection="column">
          <Text color="brand.black.500" textAlign="left">
            {info.getValue()}
          </Text>
        </Box>
      );
    },
    header: "Prénom",
  }),
  columnHelper.accessor("lastName", {
    cell: (info) => {
      return (
        <Box display="flex" flexDirection="column">
          <Text color="brand.black.500" textAlign="left">
            {info.getValue()}
          </Text>
        </Box>
      );
    },
    header: "Nom",
  }),
  columnHelper.accessor("email", {
    cell: (info) => {
      return (
        <Box display="flex" flexDirection="column">
          <Text color="brand.black.500" textAlign="left">
            {info.getValue()}
          </Text>
        </Box>
      );
    },
    header: "Email",
  }),
  columnHelper.accessor("emailConfirmed", {
    cell: (info) => {
      return (
        <Box display="flex" flexDirection="column">
          {info.getValue() ? <CheckIcon /> : <CloseIcon />}
        </Box>
      );
    },
    header: "Confirmé",
  }),
  columnHelper.accessor(
    ({ siret, etablissement, etablissements }) => [siret, etablissement, etablissements],
    {
      cell: (info) => {
        const siret = info.getValue()[0];
        const singleEtablissement = info.getValue[1];
        const etablissements = info.getValue()[2];

        return (
          <Box display="flex" flexDirection="column">
            {siret && (
              <Tooltip
                label={etablissementLabelGetter(singleEtablissement)}
                hasArrow
                arrowSize={15}
              >
                <Text>{siret}</Text>
              </Tooltip>
            )}
            {etablissements?.map((etablissement) => (
              <Tooltip
                key={etablissement.siret}
                label={etablissementLabelGetter(etablissement)}
                hasArrow
                arrowSize={15}
              >
                <Text>{etablissement.siret}</Text>
              </Tooltip>
            ))}
          </Box>
        );
      },
      header: "SIRET",
    }
  ),
  columnHelper.accessor("comment", {
    cell: (info) => {
      return (
        <Box display="flex" flexDirection="column" maxW="200px">
          <Text>{info.getValue()}</Text>
        </Box>
      );
    },
    header: "Commentaire",
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const user = info.row.original;

      return (
        <Box minW="100px">
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
        </Box>
      );
    },
    header: "Status",
  }),
  columnHelper.accessor("role", {
    cell: (info) => {
      const user = info.row.original;

      return (
        <Box minW="150px">
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
        </Box>
      );
    },
    header: "Role",
  }),
];

export default usersTableColumns;
