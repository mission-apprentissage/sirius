import React, { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import Pagination from "@codegouvfr/react-dsfr/Pagination";
import Alert from "@codegouvfr/react-dsfr/Alert";
import {
  Container,
  HeaderItem,
  ModerationContainer,
  SelectorsContainer,
  TableContainer,
} from "./moderationPage.style";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import ModerationEtablissementPicker from "./Moderation/ModerationEtablissementPicker";
import ModerationFormationPicker from "./Moderation/ModerationFormationPicker";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../constants";
import moderationTableRows from "./Moderation/moderationTableRows";
import { LoaderContainer } from "../campagnes/styles/shared.style";
import useFetchVerbatimsCount from "../hooks/useFetchVerbatimsCount";
import ModerationActions from "./Moderation/ModerationActions";

const headers = [
  "",
  <HeaderItem key="verbatim">Verbatim</HeaderItem>,
  <HeaderItem key="createdAt">Scores</HeaderItem>,
  <HeaderItem key="formation">Formation</HeaderItem>,
  <HeaderItem key="questionKey">Question</HeaderItem>,
  <HeaderItem key="createdAt">Créé le</HeaderItem>,
];

const tabs = ({
  verbatims,
  selectedVerbatims,
  setSelectedVerbatims,
  pagination,
  page,
  setPage,
  verbatimsCount,
  showOnlyDiscrepancies,
  setShowOnlyDiscrepancies,
  isLoading,
}) =>
  Object.keys(VERBATIM_STATUS).map((status) => ({
    label: (
      <>
        {VERBATIM_STATUS_LABELS[status]} (
        {verbatimsCount?.find((count) => count.status === status)?.count || 0})
      </>
    ),
    content: (
      <TableContainer>
        <ModerationActions
          selectedVerbatims={selectedVerbatims}
          setSelectedVerbatims={setSelectedVerbatims}
          showOnlyDiscrepancies={showOnlyDiscrepancies}
          setShowOnlyDiscrepancies={setShowOnlyDiscrepancies}
        />
        {isLoading ? (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        ) : verbatims.length ? (
          <>
            <Table
              headers={headers}
              data={
                moderationTableRows({ verbatims, selectedVerbatims, setSelectedVerbatims }) || []
              }
            />
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
          </>
        ) : (
          <Alert description="Aucun verbatim trouvé" severity="info">
            Aucun verbatim à afficher
          </Alert>
        )}
      </TableContainer>
    ),
    tabId: status,
  }));

const ModerationPage = () => {
  const [selectedVerbatims, setSelectedVerbatims] = useState([]);
  const [page, setPage] = useState(1);
  const [pickedEtablissement, setPickedEtablissement] = useState(null);
  const [pickedFormationId, setPickedFormationId] = useState(null);
  const [selectedTab, setSelectedTab] = useState(VERBATIM_STATUS.PENDING);
  const [showOnlyDiscrepancies, setShowOnlyDiscrepancies] = useState(false);

  const { verbatimsCount } = useFetchVerbatimsCount({
    etablissementSiret: pickedEtablissement?.siret,
    formationId: pickedFormationId,
    showOnlyDiscrepancies: showOnlyDiscrepancies,
  });

  const { verbatims, pagination, isLoading } = useFetchVerbatims({
    etablissementSiret: pickedEtablissement?.siret,
    formationId: pickedFormationId,
    selectedStatus: selectedTab,
    showOnlyDiscrepancies: showOnlyDiscrepancies,
    page,
  });

  return (
    <Container>
      <ModerationContainer>
        <h1>
          <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
          Modération des verbatims
        </h1>
        <SelectorsContainer>
          <ModerationEtablissementPicker setPickedEtablissement={setPickedEtablissement} />
          <ModerationFormationPicker
            pickedEtablissementFormationIds={pickedEtablissement?.formationIds}
            setPickedFormationId={setPickedFormationId}
          />
        </SelectorsContainer>
        <Tabs
          tabs={tabs({
            verbatims,
            selectedVerbatims,
            setSelectedVerbatims,
            pagination,
            page,
            setPage,
            verbatimsCount,
            showOnlyDiscrepancies,
            setShowOnlyDiscrepancies,
            isLoading,
          })}
          onTabChange={(tabId) => setSelectedTab(tabId.tab.tabId)}
        />
      </ModerationContainer>
    </Container>
  );
};

export default ModerationPage;
