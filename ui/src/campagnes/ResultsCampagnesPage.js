import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import Button from "@codegouvfr/react-dsfr/Button";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";
import { useGet } from "../common/hooks/httpHooks";
import {
  Container,
  ResultsCampagneContainer,
  TestimonialHeader,
} from "./styles/resultsCampagnes.style";
import SortButtons from "./Shared/SortButtons/SortButtons";
import CampagnesTable from "./Shared/CampagnesTable/CampagnesTable";
import { LoaderContainer } from "./styles/shared.style";
import { campagnesDisplayMode, campagnesSortingOptions } from "../constants";
import Statistics from "./ResultsCampagnes/Statistics/Statistics";
import ResultsCampagnesVisualisation from "./ResultsCampagnes/ResultsCampagnesVisualisation";

const ResultsCampagnesPage = () => {
  const [displayedCampagnes, setDisplayedCampagnes] = useState([]);
  const [selectedCampagnes, setSelectedCampagnes] = useState([]);
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [sortingMode, setSortingMode] = useState(campagnesSortingOptions[0].value);
  const [search, setSearch] = useState("");
  const [temoignages, setTemoignages] = useState([]);
  const [userContext] = useContext(UserContext);
  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes();
  const [questionnaires, loadingQuestionnaires, errorQuesitonnaires] =
    useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  useEffect(() => {
    if (campagnes?.length) {
      setDisplayedCampagnes(campagnes);
      setSelectedCampagnes(campagnes.map((campagne) => campagne._id));
    }
  }, [campagnes]);

  useEffect(() => {
    const getTemoignages = async () => {
      if (displayedCampagnes[0]) {
        const result = await _get(
          `/api/temoignages?campagneId=${displayedCampagnes[0]._id}`,
          userContext.token
        );
        setTemoignages(result);
      } else {
        setTemoignages([]);
      }
    };
    getTemoignages();
  }, [displayedCampagnes[0]]);

  return (
    <Container>
      <ResultsCampagneContainer>
        <SortButtons mode="results" organizeLabel="Sélectionner les résultats à afficher" />
        {loadingCampagnes && (
          <LoaderContainer>
            <BeatLoader
              color="var(--background-action-high-blue-france)"
              size={20}
              aria-label="Loading Spinner"
            />
          </LoaderContainer>
        )}
        {errorCampagnes && !campagnes?.length ? (
          <Alert
            title="Une erreur s'est produite dans le chargement des campagnes"
            description="Merci de réessayer ultérieurement"
            severity="error"
          />
        ) : null}
        {displayedCampagnes.length ? (
          <div className={fr.cx("fr-accordions-group")}>
            <Accordion label="Toutes mes campagnes">
              <CampagnesTable
                displayedCampagnes={displayedCampagnes}
                selectedCampagnes={selectedCampagnes}
                setSelectedCampagnes={setSelectedCampagnes}
                displayMode={displayMode}
              />
            </Accordion>
          </div>
        ) : null}
      </ResultsCampagneContainer>
      <Statistics campagnes={displayedCampagnes} />
      <ResultsCampagneContainer>
        <TestimonialHeader>
          <h1>
            <span className={fr.cx("fr-icon-quote-fill")} aria-hidden={true} />
            Témoignages des campagnes sélectionnées
          </h1>
          <div>
            <Button priority="secondary" iconId="fr-icon-file-download-fill">
              Exporter en XLS
            </Button>
            <Button priority="secondary" iconId="fr-icon-file-download-fill">
              Exporter en PDF
            </Button>
          </div>
        </TestimonialHeader>
        <ResultsCampagnesVisualisation
          campagne={displayedCampagnes[0]}
          temoignages={temoignages}
          questionnaire={validatedQuestionnaire?.length && validatedQuestionnaire[0].questionnaire}
          questionnaireUI={
            validatedQuestionnaire?.length && validatedQuestionnaire[0].questionnaireUI
          }
        />
      </ResultsCampagneContainer>
    </Container>
  );
};

export default ResultsCampagnesPage;
