import { useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import useFetchTemoignagesDatavisualisationPublic from "../hooks/useFetchTemoignagesDatavisualisationPublic";
import {
  DatavisualisationContainer,
  IframeContainer,
  TestimonialsCount,
} from "./IframeFormation.style";
import { LoaderContainer } from "../campagnes/styles/shared.style";
import GemVerbatim from "./Components/GemVerbatim";
import ExperienceEntrepriseRating from "./Components/ExperienceEntrepriseRating";
import SearchEntrepriseRating from "./Components/SearchEntrepriseRating";
import ExperienceEntrepriseVerbatims from "./Components/ExperienceEntrepriseVerbatims";

const IframeFormationPage = () => {
  const { search } = useLocation();
  const intituleFormation = new URLSearchParams(search).get("intitule");

  const { datavisualisation, isSuccess, isError, isLoading } =
    useFetchTemoignagesDatavisualisationPublic({
      intituleFormation,
    });

  if (isLoading) {
    return (
      <LoaderContainer>
        <BeatLoader
          color="var(--background-action-high-blue-france)"
          size={20}
          aria-label="Loading Spinner"
        />
      </LoaderContainer>
    );
  }

  if (isError || datavisualisation.temoignagesCount === 0) {
    return null;
  }

  return (
    isSuccess && (
      <IframeContainer>
        <h3>Suivre cette formation en apprentissage ?</h3>
        <p>
          Certains établissement proposent ce CAP en apprentissage. Tu hésites entre la voie
          scolaire et l’apprentissage ? Grace au questionnaire{" "}
          <a href="https://sirius.inserjeunes.beta.gouv.fr" target="_blank" rel="noreferrer">
            <b>Sirius</b>
          </a>
          , les apprenti·es qui se forment à ce CAP en France te partagent leur expérience en
          entreprise.
        </p>

        <DatavisualisationContainer>
          <TestimonialsCount>
            <p>
              <b>{datavisualisation.temoignagesCount} apprenti·es</b> en <b>{intituleFormation}</b>{" "}
              racontent comment ils vivent leur <b>expérience en entreprise</b>
            </p>
          </TestimonialsCount>
          <ExperienceEntrepriseRating rating={datavisualisation.commentCaSePasseEntrepriseRates} />
          <ExperienceEntrepriseVerbatims
            orderedVerbatims={datavisualisation.commentVisTonEntreprise}
          />
          <GemVerbatim verbatim={datavisualisation.displayedGems} />
          <SearchEntrepriseRating rating={datavisualisation.passeEntrepriseRates} />
        </DatavisualisationContainer>
      </IframeContainer>
    )
  );
};

export default IframeFormationPage;
