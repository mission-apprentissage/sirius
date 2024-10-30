import { fr } from "@codegouvfr/react-dsfr";
import { Helmet } from "react-helmet-async";

import Avatar from "../assets/images/avatar.svg";
import Community from "../assets/images/community.svg";
import DocumentAdd from "../assets/images/document_add.svg";
import School from "../assets/images/school.svg";
import useFetchEtablissementsPublicStatistics from "../hooks/useFetchEtablissementsPublicStatistics";
import { Container, ExperimentationAndTestimonyContainer, StatisticsContainer } from "./statistics.style";

const StatisticsPage = () => {
  const [etablissementsSuiviPublic] = useFetchEtablissementsPublicStatistics();

  return (
    <>
      <Helmet>
        <title>Statistiques - Sirius</title>
      </Helmet>
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
                <b>{etablissementsSuiviPublic?.createdCampagnesCount || 0} promotions</b> <br />
                interrogées
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
                <b>{etablissementsSuiviPublic?.verbatimsCount || 0} verbatims</b> <br />
                formulés
              </p>
            </div>
          </StatisticsContainer>
        </ExperimentationAndTestimonyContainer>
      </Container>
    </>
  );
};

export default StatisticsPage;
