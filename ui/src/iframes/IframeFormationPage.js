/* eslint-disable no-undef */

import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { LoaderContainer } from "../campagnes/styles/shared.style";
import useFetchDatavisualisationFormation from "../hooks/useFetchDatavisualisationFormation";
import useMatomoEvent from "../hooks/useMatomoEvent";
import ExperienceEnEntrepriseRating from "./Components/ExperienceEnEntrepriseRating";
import TrouverUneEntrepriseRating from "./Components/TrouverUneEntrepriseRating";
import { VerbatimsCarousel } from "./Components/VerbatimsCarousel";
import VerbatimsQuestions from "./Components/VerbatimsQuestions";
import VerbatimsThematics from "./Components/VerbatimsThematics";
import { ConstructionNotice, IframeContainer, TitleContainer } from "./IframeFormation.style";

const IframeFormationPage = () => {
  const [verbatimsStep, setVerbatimsStep] = useState(1);
  const [goToThematic, setGoToThematic] = useState(null);
  const scrollableRef = useRef(null);
  const { search } = useLocation();

  const intituleFormation = new URLSearchParams(search).get("intitule");
  const cfd = new URLSearchParams(search).get("cfd");
  const idCertifinfo = new URLSearchParams(search).get("id_certifinfo");
  const slug = new URLSearchParams(search).get("slug");

  const { datavisualisation, isSuccess, isError, isLoading } = useFetchDatavisualisationFormation({
    intituleFormation,
    cfd,
    idCertifinfo,
    slug,
  });

  useEffect(() => {
    if (isSuccess) {
      window.parent.postMessage(
        {
          src: window.location.href,
          height: document.body.scrollHeight,
          siriusHeight: document.body.scrollHeight + 50,
        },
        "*"
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    const handleResize = () => {
      window.parent.postMessage(
        {
          src: window.location.href,
          height: document.body.scrollHeight,
          siriusHeight: document.body.scrollHeight + 50,
        },
        "*"
      );
    };

    document.addEventListener("click", handleResize);

    return () => {
      document.removeEventListener("click", handleResize);
    };
  }, []);

  useEffect(() => {
    if (goToThematic) {
      scrollableRef.current.scrollIntoView({ behavior: "smooth" });
      setVerbatimsStep(2);
    }
  }, [goToThematic]);

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
          <title>{`Statistiques pour la formation ${datavisualisation?.intituleFormation} - Sirius`}</title>
        </Helmet>
        <IframeContainer ref={scrollableRef}>
          <TitleContainer>
            <h2>Témoignages d'apprentis</h2>
            <Badge as="span" noIcon severity="success">
              Beta
            </Badge>
          </TitleContainer>
          {verbatimsStep === 1 ? (
            <p>
              Tu hésites entre la voie scolaire et l'apprentissage ? Les apprentis qui se forment en France te partagent
              leur expérience authentique.
            </p>
          ) : null}
          <ConstructionNotice>
            <span className={fr.cx("fr-icon-info-fill")} aria-hidden={true} />
            <p>
              Ce service est en cours de construction. Les résultats ne sont pas encore représentatifs de l'ensemble des
              établissements et formations.
            </p>
          </ConstructionNotice>
          {verbatimsStep === 1 ? (
            <VerbatimsCarousel
              verbatims={Object.values(datavisualisation?.gems || {}).flat()}
              setVerbatimsStep={setVerbatimsStep}
            />
          ) : null}
          {verbatimsStep === 2 ? (
            <VerbatimsThematics
              verbatimsByThemes={datavisualisation?.verbatimsByThemes}
              setVerbatimsStep={setVerbatimsStep}
              goToThematics={goToThematic}
              setGoToThematics={setGoToThematic}
            />
          ) : null}
          {verbatimsStep === 3 ? (
            <VerbatimsQuestions
              verbatimsByQuestions={datavisualisation?.verbatimsByQuestions}
              setVerbatimsStep={setVerbatimsStep}
            />
          ) : null}
          <TrouverUneEntrepriseRating
            data={datavisualisation?.trouverEntrepriseRating}
            etablissementsCount={datavisualisation?.etablissementsCount}
          />
          <ExperienceEnEntrepriseRating
            data={datavisualisation?.commentVisTonExperienceEntrepriseRating}
            etablissementsCount={datavisualisation?.etablissementsCount}
            setGoToThematic={setGoToThematic}
          />
          <p>
            Données collectées avec le questionnaire{" "}
            <a href="https://sirius.inserjeunes.beta.gouv.fr/" target="_blank" rel="noreferrer">
              Sirius
            </a>
          </p>
        </IframeContainer>
      </>
    )
  );
};

export default IframeFormationPage;
