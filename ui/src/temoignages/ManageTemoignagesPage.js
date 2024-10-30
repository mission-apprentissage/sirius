import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Range } from "@codegouvfr/react-dsfr/Range";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BeatLoader from "react-spinners/BeatLoader";

import { LoaderContainer } from "../campagnes/styles/shared.style";
import useFetchUncompliantTemoignages from "../hooks/useFetchUncompliantTemoignages";
import DeleteTemoignagesConfirmationModal from "./Components/DeleteTemoignagesConfirmationModal";
import ManageTemoignagesTable from "./Components/ManageTemoignagesTable";
import { Container, FiltersContainer, ManageTemoignagesContainer } from "./manageTemoignages.style";

const deleteTemoignagesConfirmationModal = createModal({
  id: "delete-temoiganges-modal",
  isOpenedByDefault: false,
});

const TabContent = ({
  isLoading,
  isError,
  isSuccess,
  uncompliantTemoignages,
  page,
  setPage,
  selectedTemoignagesIds,
  setSelectedTemoignagesIds,
}) => {
  return (
    <>
      {isLoading && (
        <LoaderContainer>
          <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
        </LoaderContainer>
      )}
      {isError && (
        <Alert
          title="Une erreur s'est produite dans le chargement des témoignages"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      )}
      {!isLoading && !isError && !uncompliantTemoignages?.body.length && (
        <Alert title="Il n'y a pas de témoignages dans cette catégorie" severity="info" />
      )}
      {isSuccess && uncompliantTemoignages?.body.length > 0 && (
        <ManageTemoignagesTable
          temoignages={uncompliantTemoignages.body}
          pagination={uncompliantTemoignages.pagination}
          page={page}
          setPage={setPage}
          selectedTemoignagesIds={selectedTemoignagesIds}
          setSelectedTemoignagesIds={setSelectedTemoignagesIds}
          deleteTemoignagesConfirmationModal={deleteTemoignagesConfirmationModal}
        />
      )}
    </>
  );
};

const createTab = (label, type, count, props) => {
  return {
    label: `${label} (${count || 0})`,
    content: <TabContent {...props} />,
    type,
  };
};

const ManageTemoignagesPage = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [duration, setDuration] = useState(4);
  const [includeUnavailableDuration, setIncludeUnavailableDuration] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState(12);
  const [selectedTemoignagesIds, setSelectedTemoignagesIds] = useState([]);

  const { uncompliantTemoignages, isSuccess, isError, isLoading } = useFetchUncompliantTemoignages({
    type: selectedTab,
    duration,
    answeredQuestions,
    includeUnavailableDuration,
    page,
    pageSize: 50,
  });

  useEffect(() => {
    if (uncompliantTemoignages?.count) {
      setCount(uncompliantTemoignages.count);
    }
  }, [uncompliantTemoignages, count, duration, answeredQuestions, includeUnavailableDuration]);

  const tabsProps = {
    uncompliantTemoignages,
    count,
    isLoading,
    isError,
    isSuccess,
    page,
    setPage,
    selectedTemoignagesIds,
    setSelectedTemoignagesIds,
  };
  const tabs = [
    createTab("Tous", "all", count?.total, tabsProps),
    createTab("Durée", "quick", count?.quickCount, tabsProps),
    createTab("Complétion", "incomplete", count?.incompleteCount, tabsProps),
    createTab("Bot", "bot", count?.botCount, tabsProps),
  ];

  return (
    <>
      <Helmet>
        <title>Gérer les témoignages - Sirius</title>
      </Helmet>
      <Container>
        <ManageTemoignagesContainer>
          <h1>
            <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
            Gestion des réponses non conformes
          </h1>
          <FiltersContainer>
            <div>
              <ToggleSwitch
                label="Inclure les durée de passation indisponible"
                onChange={() => setIncludeUnavailableDuration(!includeUnavailableDuration)}
                checked={includeUnavailableDuration}
                inputTitle="the-title"
              />
              <Range
                label="Durée de passation"
                max={15}
                min={1}
                suffix=" min"
                small
                nativeInputProps={{
                  value: duration,
                  onChange: (e) => setDuration(e.target.value),
                }}
              />
            </div>
            <div>
              <Range
                label="Questions répondues"
                max={25}
                min={2}
                suffix=" questions répondues"
                small
                nativeInputProps={{
                  value: answeredQuestions,
                  onChange: (e) => setAnsweredQuestions(e.target.value),
                }}
              />
            </div>
          </FiltersContainer>
          <Tabs
            tabs={tabs}
            onTabChange={(e) => {
              setPage(1);
              setSelectedTab(e.tab.type);
            }}
          />
        </ManageTemoignagesContainer>
      </Container>
      <DeleteTemoignagesConfirmationModal
        modal={deleteTemoignagesConfirmationModal}
        selectedTemoignagesIds={selectedTemoignagesIds}
        setSelectedTemoignagesIds={setSelectedTemoignagesIds}
      />
    </>
  );
};

export default ManageTemoignagesPage;
