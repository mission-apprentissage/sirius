/* eslint-disable no-undef */

import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { LoaderContainer } from "../campagnes/styles/shared.style";
import { VERBATIM_STATUS } from "../constants";
import useFetchDatavisualisationFormation from "../hooks/useFetchDatavisualisationFormation";
import { VerbatimsCarousel } from "./Components/VerbatimsCarousel";
import VerbatimsThematics from "./Components/VerbatimsThematics";
import { ConstructionNotice, IframeContainer, TitleContainer } from "./IframeFormation.style";

const IframeFormationPage = () => {
  const [verbatimsStep, setVerbatimsStep] = useState(1);
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
          <TitleContainer>
            <h3>Témoignages d'apprentis</h3>
            <Badge as="span" noIcon severity="success">
              Beta
            </Badge>
          </TitleContainer>
          {verbatimsStep === 1 && (
            <p>
              Tu hésites entre la voie scolaire et l'apprentissage ? Grace au questionnaire{" "}
              <a href="https://sirius.inserjeunes.beta.gouv.fr" target="_blank" rel="noreferrer">
                <b>Sirius</b>
              </a>
              , les apprentis qui se forment en France te partagent leur expérience.
            </p>
          )}
          <ConstructionNotice>
            <span className={fr.cx("fr-icon-information-line")} aria-hidden={true} />
            <p>
              Ce service est en cours de construction. Les résultats ne sont pas encore représentatifs de l'ensemble des
              établissements et formations.
            </p>
          </ConstructionNotice>
          {verbatimsStep === 1 && (
            <VerbatimsCarousel
              verbatims={Object.values(datavisualisation?.gems).flat()}
              setVerbatimsStep={setVerbatimsStep}
            />
          )}
          {verbatimsStep === 2 && (
            <VerbatimsThematics
              verbatimsByThemes={datavisualisation?.verbatimsByThemes}
              setVerbatimsStep={setVerbatimsStep}
            />
          )}
        </IframeContainer>
      </>
    )
  );
};

export default IframeFormationPage;
