import React, { useState } from "react";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { msToTime } from "../../utils/temoignage";
import Tooltip from "react-simple-tooltip";
import {
  ToolTipContainer,
  ActionsContainer,
  DeleteButtonContainer,
} from "../manageTemoignages.style";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import DisplayReponsesModal from "./DisplayReponsesModal";
import { TableContainer } from "../../campagnes/styles/shared.style";
import { isPlural } from "../../campagnes/utils";

const displayReponsesModal = createModal({
  id: "display-reponses-modal",
  isOpenedByDefault: false,
});

const headers = [
  "",
  "Établissement & formation",
  "Durée de passation",
  "Questions répondues",
  "Bot",
  "Afficher",
];

const ManageTemoignagesTable = ({
  temoignages,
  pagination,
  page,
  setPage,
  selectedTemoignagesIds,
  setSelectedTemoignagesIds,
  deleteTemoignagesConfirmationModal,
}) => {
  const [currentTemoignageAction, setCurrentTemoignageAction] = useState({});

  const data = temoignages?.map((temoignage) => {
    return [
      <Checkbox
        key={temoignage.id}
        options={[
          {
            nativeInputProps: {
              name: `temoignage-${temoignage.id}`,
              checked: selectedTemoignagesIds.includes(temoignage.id),
              onChange: () =>
                setSelectedTemoignagesIds((prevValues) => {
                  if (prevValues.includes(temoignage.id)) {
                    return prevValues.filter((id) => id !== temoignage.id);
                  } else {
                    return [...prevValues, temoignage.id];
                  }
                }),
            },
          },
        ]}
      />,
      <div key={temoignage.id}>
        <p>{temoignage.formation.intituleLong}</p>
        <p key={temoignage.id}>
          {temoignage.formation.etablissementFormateurEntrepriseRaisonSociale ||
            temoignage.formation.etablissementFormateurEnseigne}
        </p>
      </div>,
      <Tooltip
        key={temoignage.id}
        background="var(--background-default-grey)"
        border="var(--border-default-grey)"
        color="var(--text-default-grey)"
        placement="right"
        content={
          <ToolTipContainer>
            <span>Le: {new Date(temoignage.createdAt).toLocaleDateString("fr-FR")}</span>
            <span>
              Début: {new Date(temoignage.createdAt).toLocaleTimeString("fr-FR") || "N/A"}
            </span>
            <span>
              Fin:{" "}
              {temoignage.lastQuestionAt
                ? new Date(temoignage.lastQuestionAt).toLocaleTimeString("fr-FR")
                : "N/A"}
            </span>
          </ToolTipContainer>
        }
      >
        <p>
          {temoignage.lastQuestionAt && temoignage.createdAt
            ? msToTime(
                new Date(temoignage.lastQuestionAt).getTime() -
                  new Date(temoignage.createdAt).getTime()
              )
            : "N/A"}
        </p>
      </Tooltip>,
      <p key={temoignage.id}>{Object.keys(temoignage.reponses).length}</p>,
      <p key={temoignage.id}>{temoignage.isBot ? "Oui" : "Non"}</p>,
      <ActionsContainer key={temoignage.id}>
        <Button
          iconId="fr-icon-eye-fill"
          priority="tertiary no outline"
          onClick={() => {
            setCurrentTemoignageAction(temoignage);
            displayReponsesModal.open();
          }}
          title="Voir le témoignage"
        />
      </ActionsContainer>,
    ];
  });

  const checkboxLabel = (
    <b>
      {selectedTemoignagesIds.length
        ? `${selectedTemoignagesIds.length} témoignage${isPlural(
            selectedTemoignagesIds.length
          )} sélectionné${isPlural(selectedTemoignagesIds.length)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <TableContainer>
      <DeleteButtonContainer>
        <Checkbox
          options={[
            {
              label: checkboxLabel,
              nativeInputProps: {
                name: `SelectAll`,
                checked: temoignages
                  .map((temoignage) => temoignage.id)
                  .every((id) => selectedTemoignagesIds.includes(id)),
                onChange: (e) => {
                  setSelectedTemoignagesIds(
                    e.target.checked ? temoignages.map((temoignage) => temoignage.id) : []
                  );
                },
              },
            },
          ]}
        />
        <Button
          priority="secondary"
          iconId="fr-icon-delete-line"
          onClick={() => deleteTemoignagesConfirmationModal.open()}
          disabled={!selectedTemoignagesIds.length}
        >
          Supprimer
        </Button>
      </DeleteButtonContainer>
      <Table headers={headers} data={data || []} />
      {pagination.totalPages > 1 && (
        <Pagination
          count={pagination.totalPages}
          defaultPage={page}
          getPageLinkProps={(pageNumber) => ({
            onClick: (event) => {
              event.preventDefault();
              setPage(pageNumber);
            },
            key: `pagination-link-${pageNumber}`,
          })}
        />
      )}
      <DisplayReponsesModal modal={displayReponsesModal} temoignage={currentTemoignageAction} />
    </TableContainer>
  );
};

export default ManageTemoignagesTable;
