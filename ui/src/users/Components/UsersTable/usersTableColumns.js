import jwt from "jwt-decode";
import { Tooltip, Box, Select, Text, IconButton } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckIcon, AddIcon, CopyIcon, CloseIcon, UnlockIcon } from "@chakra-ui/icons";
import { USER_ROLES, USER_STATUS } from "../../../constants";
import { etablissementLabelGetter } from "../../../utils/etablissement";
import { _get } from "../../../utils/httpClient";

const columnHelper = createColumnHelper();

const usersTableColumns = (
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
  columnHelper.accessor("_id", {
    cell: (info) => {
      const user = info.row.original;
      if (user.role === USER_ROLES.ADMIN) return null;
      return (
        <Box display="flex">
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
          <Tooltip label="Se connecter en tant que l'utilisateur" hasArrow>
            <IconButton
              size="sm"
              aria-label="Se connecter en tant que l'utilisateur"
              icon={<UnlockIcon />}
              onClick={async () => {
                const result = await _get(`/api/users/sudo/${user._id}`, userContext.token);
                if (result.success) {
                  const decodedToken = jwt(result.token);
                  setUserContext((oldValues) => {
                    return {
                      ...oldValues,
                      token: result.token,
                      loading: false,
                      currentUserId: decodedToken._id,
                      currentUserRole: decodedToken.role,
                      currentUserStatus: decodedToken.status,
                      firstName: decodedToken.firstName,
                      lastName: decodedToken.lastName,
                      email: decodedToken.email,
                      siret: decodedToken.siret,
                      acceptedCgu: decodedToken.acceptedCgu || false,
                      etablissements: decodedToken.etablissements || [],
                    };
                  });
                  if (decodedToken.role === USER_ROLES.ETABLISSEMENT) {
                    localStorage.setItem(
                      "etablissements",
                      JSON.stringify({
                        siret: decodedToken.siret || decodedToken.etablissements[0].siret,
                        etablissementLabel:
                          decodedToken.etablissementLabel ||
                          etablissementLabelGetter(decodedToken.etablissements[0]),
                        etablissements: decodedToken.etablissements || [],
                      })
                    );
                  }

                  navigate("/campagnes/gestion");
                }
              }}
            />
          </Tooltip>
        </Box>
      );
    },
    header: "Action",
  }),
];

export default usersTableColumns;
