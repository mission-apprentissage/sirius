/* eslint-disable no-undef */
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { LoaderContainer } from "../campagnes/styles/shared.style";
import useFetchDatavisualisationFormation from "../hooks/useFetchDatavisualisationFormation";
import ExperienceEntrepriseRating from "./Components/ExperienceRating";
import ExperienceEntrepriseVerbatims from "./Components/ExperienceVerbatims";
import SearchEntrepriseRating from "./Components/FeelingRating";
import GemVerbatim from "./Components/GemVerbatim";
import { DatavisualisationContainer, IframeContainer, TestimonialsCount } from "./IframeFormation.style";

const IframeFormationPage = () => {
  const scrollableRef = useRef(null);
  const { search } = useLocation();
  const intituleFormation = new URLSearchParams(search).get("intitule");

  const { datavisualisation, isSuccess, isError, isLoading } = useFetchDatavisualisationFormation({
    intituleFormation,
  });

  useEffect(() => {
    if (isSuccess) {
      window.parent.postMessage({ siriusHeight: document.body.scrollHeight + 50 }, "*");
    }
  }, [isSuccess]);

  useEffect(() => {
    const handleResize = () => {
      window.parent.postMessage({ siriusHeight: document.body.scrollHeight + 50 }, "*");
    };

    document.addEventListener("click", handleResize);

    return () => {
      document.removeEventListener("click", handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <LoaderContainer>
        <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
      </LoaderContainer>
    );
  }

  if (!datavisualisation || isError || datavisualisation.temoignagesCount === 0) {
    return null;
  }

  return (
    isSuccess && (
      <>
        <Helmet>
          <title>{`Statistiques pour la formation ${intituleFormation} - Sirius`}</title>
        </Helmet>
        <IframeContainer ref={scrollableRef}>
          <h3>Suivre cette formation en apprentissage ?</h3>
          <p>
            Certains établissement proposent ce CAP en apprentissage. Tu hésites entre la voie scolaire et
            l’apprentissage ? Grace au questionnaire{" "}
            <a href="https://sirius.inserjeunes.beta.gouv.fr" target="_blank" rel="noreferrer">
              <b>Sirius</b>
            </a>
            , les apprenti·es qui se forment à ce CAP en France te partagent leur expérience en entreprise.
          </p>

          <DatavisualisationContainer>
            <TestimonialsCount>
              <p>
                <b>Expérience en entreprise</b> ({datavisualisation.temoignagesCount} apprenti·es interrogé·es)
              </p>
            </TestimonialsCount>
            <ExperienceEntrepriseRating rating={datavisualisation.commentCaSePasseEntrepriseRates} />
            <ExperienceEntrepriseVerbatims orderedVerbatims={datavisualisation.commentVisTonEntreprise} />
            <GemVerbatim verbatim={datavisualisation.displayedGems} />
            <SearchEntrepriseRating rating={datavisualisation.passeEntrepriseRates} isFormation={true} />
          </DatavisualisationContainer>
        </IframeContainer>
      </>
    )
  );
};

export default IframeFormationPage;
