import { Tooltip, Box, Select, Text, IconButton } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckIcon, AddIcon, CopyIcon, CloseIcon, UnlockIcon } from "@chakra-ui/icons";
import { OBSERVER_SCOPES, USER_ROLES, USER_STATUS } from "../../../constants";
import { etablissementLabelGetter } from "../../../utils/etablissement";

const columnHelper = createColumnHelper();

const usersTableColumns = (
  userContext,
  setSelectedUser,
  setSelectedStatus,
  onOpenStatusConfirmation,
  setSelectedRole,
  onOpenRoleConfirmation,
  setClipboardValue,
  onCopyClipBoard,
  onOpenAddSiret,
  onOpenAddScope,
  setSudoUserId
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
      const confirmationToken = info.row.original.confirmationToken;

      return (
        <Box display="flex" flexDirection="column">
          {info.getValue() ? (
            <CheckIcon />
          ) : (
            <Box>
              <CloseIcon />
              {confirmationToken && (
                <Tooltip label="Copier le lien de confirmation">
                  <CopyIcon
                    ml="1"
                    cursor="pointer"
                    onClick={() => {
                      setClipboardValue(
                        `${window.location.hostname}/confirmer-utilisateur?token=${confirmationToken}`
                      );
                      onCopyClipBoard();
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      );
    },
    header: "Confirmé",
  }),
  columnHelper.accessor(
    ({ siret, etablissement, etablissements, scope }) => [
      siret,
      etablissement,
      etablissements,
      scope,
    ],
    {
      cell: (info) => {
        const siret = info.getValue()[0];
        const singleEtablissement = info.getValue[1];
        const etablissements = info.getValue()[2];
        const scope = info.getValue()[3];

        if (scope?.field === OBSERVER_SCOPES.NATIONAL) {
          return (
            <Box display="flex" flexDirection="column">
              <Text>National</Text>
            </Box>
          );
        }

        if (typeof scope?.value === "string") {
          return (
            <Box display="flex" flexDirection="column">
              <Text>{scope.value}</Text>
            </Box>
          );
        } else if (typeof scope?.value === "object") {
          return (
            <Box display="flex" flexDirection="column">
              {scope.value?.map((value) => (
                <Text key={value}>{value}</Text>
              ))}
            </Box>
          );
        }

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
          {user._id === userContext.user?._id ? (
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
          {user._id === userContext.user?._id ? (
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
  columnHelper.accessor("_id", {
    cell: (info) => {
      const user = info.row.original;
      if (user.role === USER_ROLES.ADMIN) return null;
      return (
        <Box display="flex">
          {user.role === USER_ROLES.ETABLISSEMENT && (
            <Tooltip label="Ajouter un SIRET" hasArrow>
              <IconButton
                size="sm"
                aria-label="ajout SIRET"
                icon={<AddIcon />}
                mr="2"
                onClick={() => {
                  setSelectedUser(user);
                  onOpenAddSiret();
                }}
              />
            </Tooltip>
          )}
          {user.role === USER_ROLES.OBSERVER && (
            <Tooltip label="Ajouter un scope" hasArrow>
              <IconButton
                size="sm"
                aria-label="ajout scope"
                icon={<AddIcon />}
                mr="2"
                onClick={() => {
                  setSelectedUser(user);
                  onOpenAddScope();
                }}
              />
            </Tooltip>
          )}
          <Tooltip label="Se connecter en tant que l'utilisateur" hasArrow>
            <IconButton
              size="sm"
              aria-label="Se connecter en tant que l'utilisateur"
              icon={<UnlockIcon />}
              onClick={() => setSudoUserId(user._id)}
            />
          </Tooltip>
        </Box>
      );
    },
    header: "Action",
  }),
];

export default usersTableColumns;
