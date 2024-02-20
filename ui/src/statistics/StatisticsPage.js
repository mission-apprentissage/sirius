import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import useFetchEtablissementsPublicSuivi from "../hooks/useFetchEtablissementsPublicSuivi";
import {
  Container,
  ExperimentationAndTestimonyContainer,
  StatisticsContainer,
} from "./statistics.style";
import School from "../assets/images/school.svg";
import DocumentAdd from "../assets/images/document_add.svg";
import Avatar from "../assets/images/avatar.svg";
import Community from "../assets/images/community.svg";

const StatisticsPage = () => {
  const [etablissementsSuiviPublic] = useFetchEtablissementsPublicSuivi();

  return (
    <Container>
      <div>
        <h1>Statistiques</h1>
        <h5>Sirius, recueillir et exposer les avis d’apprenti·es sur leur formation</h5>
      </div>
      <ExperimentationAndTestimonyContainer>
        <>
          <h2>
            <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
            Les premiers chiffres de l’expérimentation
          </h2>
        </>
        <p>Données issues de la plateforme Sirius et mises à jour en temps réel</p>
        <StatisticsContainer>
          <div>
            <img src={School} alt="" />
            <p>
              <b>{etablissementsSuiviPublic?.etablissementsCount || 0} établissements</b> <br />
              inscrits sur la plateforme
            </p>
          </div>
          <div>
            <img src={DocumentAdd} alt="" />
            <p>
              <b>{etablissementsSuiviPublic?.createdCampagnesCount || 0} campagnes</b> <br />
              de diffusion crées
            </p>
          </div>
          <div>
            <img src={Avatar} alt="" />
            <p>
              <b>{etablissementsSuiviPublic?.temoignagesCount || 0} apprenti·es</b> <br />
              ayant témoigné·es
            </p>
          </div>
          <div>
            <img src={Community} alt="" />
            <p>
              <b>{etablissementsSuiviPublic?.champsLibreCount || 0} verbatims</b> <br />
              formulés
            </p>
          </div>
        </StatisticsContainer>
      </ExperimentationAndTestimonyContainer>
    </Container>
  );
};

export default StatisticsPage;
