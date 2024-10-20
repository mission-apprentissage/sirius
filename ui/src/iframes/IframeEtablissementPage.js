/* eslint-disable no-undef */
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { LoaderContainer } from "../campagnes/styles/shared.style";
import useFetchDatavisualisationEtablissement from "../hooks/useFetchDatavisualisationEtablissement";
import ExperienceEntrepriseRating from "./Components/ExperienceRating";
import ExperienceEntrepriseVerbatims from "./Components/ExperienceVerbatims";
import SearchEntrepriseRating from "./Components/FeelingRating";
import GemVerbatim from "./Components/GemVerbatim";
import { DatavisualisationContainer, IframeContainer, TestimonialsCount } from "./IframeFormation.style";

const IframeEtablissementPage = () => {
  const scrollableRef = useRef(null);
  const { search } = useLocation();
  const uai = new URLSearchParams(search).get("uai");

  const { datavisualisation, isSuccess, isError, isLoading } = useFetchDatavisualisationEtablissement({
    uai,
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
      <IframeContainer ref={scrollableRef}>
        <h3>Suivre une formation en apprentissage ?</h3>
        <p>
          Cet établissement propose de suivre certaines de ses formations en apprentissage. Grace au questionnaire{" "}
          <a href="https://sirius.inserjeunes.beta.gouv.fr" target="_blank" rel="noreferrer">
            <b>Sirius</b>
          </a>
          , les apprenti·es qui se forment dans cet établissement te partagent leur expérience.
        </p>

        <DatavisualisationContainer>
          <TestimonialsCount>
            <p>
              <b>Expérience dans cet établissement</b> ({datavisualisation.temoignagesCount} apprenti·es interrogé·es)
            </p>
          </TestimonialsCount>
          <ExperienceEntrepriseRating rating={datavisualisation.commentCaSePasseCfaRates} />
          <ExperienceEntrepriseVerbatims orderedVerbatims={datavisualisation.commentVisTonCfa} />
          <GemVerbatim verbatim={datavisualisation.displayedGems} />
          <SearchEntrepriseRating rating={datavisualisation.accompagneCfaRates} isEtablissement={true} />
        </DatavisualisationContainer>
      </IframeContainer>
    )
  );
};

export default IframeEtablissementPage;
