import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Pagination } from "@codegouvfr/react-dsfr/Pagination";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { LoaderContainer } from "../campagnes/styles/shared.style";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../constants";
import useFetchVerbatims from "../hooks/useFetchVerbatims";
import useFetchVerbatimsCount from "../hooks/useFetchVerbatimsCount";
import usePatchVerbatims from "../hooks/usePatchVerbatims";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import ModerationActions from "./Moderation/ModerationActions";
import ModerationEtablissementPicker from "./Moderation/ModerationEtablissementPicker";
import ModerationFormationPicker from "./Moderation/ModerationFormationPicker";
import moderationTableRows from "./Moderation/moderationTableRows";
import { Container, HeaderItem, ModerationContainer, SelectorsContainer, TableContainer } from "./moderationPage.style";

const SelectAll = ({ selectedVerbatims, setSelectedVerbatims, verbatims }) => {
  const allVerbatimsSelected = selectedVerbatims.length === verbatims.length;

  return (
    <Checkbox
      options={[
        {
          nativeInputProps: {
            name: "select-all",
            checked: allVerbatimsSelected,
            onChange: () => {
              if (allVerbatimsSelected) {
                setSelectedVerbatims([]);
              } else {
                setSelectedVerbatims(verbatims.map((verbatim) => verbatim));
              }
            },
          },
        },
      ]}
    />
  );
};

const getHeaders = ({ selectedVerbatims, setSelectedVerbatims, verbatims }) => [
  <SelectAll
    key="selectAll"
    selectedVerbatims={selectedVerbatims}
    setSelectedVerbatims={setSelectedVerbatims}
    verbatims={verbatims}
  />,
  <HeaderItem key="verbatim">Verbatim Exposé</HeaderItem>,
  <HeaderItem key="createdAt">Scores</HeaderItem>,
  <HeaderItem key="ia">IA</HeaderItem>,
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
  patchVerbatims,
}) =>
  Object.keys(VERBATIM_STATUS).map((status) => ({
    label: (
      <>
        {VERBATIM_STATUS_LABELS[status]} ({verbatimsCount?.find((count) => count.status === status)?.count || 0})
      </>
    ),
    content: (
      <TableContainer>
        <ModerationActions
          selectedVerbatims={selectedVerbatims}
          showOnlyDiscrepancies={showOnlyDiscrepancies}
          setShowOnlyDiscrepancies={setShowOnlyDiscrepancies}
          patchVerbatims={patchVerbatims}
        />
        {isLoading ? (
          <LoaderContainer>
            <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
          </LoaderContainer>
        ) : verbatims.length ? (
          <>
            <Table
              headers={getHeaders({ selectedVerbatims, setSelectedVerbatims, verbatims })}
              data={moderationTableRows({ verbatims, selectedVerbatims, setSelectedVerbatims }) || []}
            />
            {pagination.totalPages > 1 && (
              <Pagination
                count={pagination.totalPages}
                defaultPage={page}
                getPageLinkProps={(pageNumber) => ({
                  onClick: (event) => {
                    event.preventDefault();
                    setPage(pageNumber);
                    // eslint-disable-next-line no-undef
                    window.scrollTo(0, 0);
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
  const [isPatchSuccessful, setIsPatchSuccessful] = useState(null);
  const [page, setPage] = useState(1);
  const [pickedEtablissement, setPickedEtablissement] = useState(null);
  const [pickedFormationId, setPickedFormationId] = useState(null);
  const [selectedTab, setSelectedTab] = useState(VERBATIM_STATUS.PENDING);
  const [showOnlyDiscrepancies, setShowOnlyDiscrepancies] = useState(false);

  const helmet = useSetAndTrackPageTitle({ title: `Modérer les verbatims - Sirius` });

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

  const { mutate: patchVerbatims, patchedVerbatims } = usePatchVerbatims();

  const patchedVerbatimCount = patchedVerbatims?.length;

  useEffect(() => {
    if (patchedVerbatims?.length) {
      if (patchedVerbatimCount === selectedVerbatims.length) {
        setIsPatchSuccessful(true);
      } else {
        setIsPatchSuccessful(false);
      }
      setSelectedVerbatims([]);
      setPage(1);
      setTimeout(() => {
        setIsPatchSuccessful(null);
      }, 5000);
    }
  }, [patchedVerbatims]);

  return (
    <>
      {helmet}
      <Container>
        <ModerationContainer>
          <h1>
            <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
            Modération des verbatims
          </h1>
          <SelectorsContainer>
            <ModerationEtablissementPicker setPickedEtablissement={setPickedEtablissement} />
            <ModerationFormationPicker
              pickedEtablissementSiret={pickedEtablissement?.siret}
              setPickedFormationId={setPickedFormationId}
            />
          </SelectorsContainer>
          {isPatchSuccessful && patchedVerbatimCount && (
            <Alert
              severity="success"
              title="Le status des verbatims a été mis à jour avec succès"
              description={`${patchedVerbatimCount} verbatims impactés`}
              closable
            />
          )}
          {isPatchSuccessful === false && (
            <Alert
              severity="error"
              title="Une erreur s'est produite lors de la mise à jour des status"
              description="Merci de réessayer plus tard"
              closable
            />
          )}
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
              patchVerbatims,
            })}
            onTabChange={(tabId) => setSelectedTab(tabId.tab.tabId)}
          />
        </ModerationContainer>
      </Container>
    </>
  );
};

export default ModerationPage;
