import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import {
  Container,
  GoalContainer,
  CFAContainer,
  CardContainer,
  StyledCard,
  CFAButtonContainer,
  ExperimentationAndTestimonyContainer,
  StatisticsContainer,
  QuotesContainer,
  ExpressedTestimonies,
  ScrollToTop,
} from "./home.style";
import { useGet } from "../common/hooks/httpHooks";
import LogoWithoutText from "../assets/images/logo_without_text.svg";
import IlluQuestionnaire from "../assets/images/illu_questionnaire.svg";
import IlluPlateforme from "../assets/images/illu_plateforme.svg";
import IlluDonnees from "../assets/images/illu_donnees.svg";
import IlluExpo from "../assets/images/illu_expo.svg";
import IlluCFA from "../assets/images/illu_cfa.svg";
import School from "../assets/images/school.svg";
import DocumentAdd from "../assets/images/document_add.svg";
import Avatar from "../assets/images/avatar.svg";
import Community from "../assets/images/community.svg";
import useFetchEtablissementsPublicSuivi from "../hooks/useFetchEtablissementsPublicSuivi";
import NeedHelp from "../Components/NeedHelp";

const HomePage = () => {
  const navigate = useNavigate();
  const [questionnaires] = useGet(`/api/questionnaires/`);
  const [etablissementsSuiviPublic] = useFetchEtablissementsPublicSuivi();

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  return (
    <>
      <Container>
        <h2>
          Avec Sirius recueillez les témoignages de vos apprenti·es{" "}
          <span style={{ fontWeight: "400" }}>
            infra-bac pour mieux informer sur la réalité de l'apprentissage
          </span>
        </h2>
        <GoalContainer>
          <img src={LogoWithoutText} alt="" />
          <section>
            <div>
              <h3>Recueillir</h3>
              <p>
                <b>auprès des 4000 CFA</b> formateurs qui dispensent des formations en apprentissage
                de <b>niveau infra-bac</b> (périmètre de notre première expérimentation)
              </p>
            </div>
            <div>
              <h3>Exposer</h3>
              <p>
                la donnée aux <b>370 000 élèves</b> qui s’orientent vers l’apprentissage, aux{" "}
                <b>13 000 professeurs principaux et 3 000 PsyEN</b>
              </p>
            </div>
          </section>
          <Button iconId="fr-icon-account-circle-fill" onClick={() => navigate("/inscription")}>
            S'inscrire
          </Button>
        </GoalContainer>
        <CFAContainer display="flex" flexDirection="column">
          <p>Vous êtes un CFA ?</p>
          <h2>Sirius entre vos mains, c’est :</h2>
          <CardContainer>
            <StyledCard
              imageComponent={<img src={IlluQuestionnaire} alt="" />}
              start={<Tag>Questionnaire</Tag>}
              title="Un questionnaire anonyme pour interroger vos apprenti·es"
              desc="💬 Recueillez des témoignages qui reflètent leurs expériences vécues"
              size="small"
              titleAs="h6"
              footer={
                <Link
                  className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
                  to={`/questionnaires/${
                    validatedQuestionnaire?.length && validatedQuestionnaire[0]._id
                  }/apercu`}
                >
                  Aperçu du questionnaire
                </Link>
              }
            />
            <StyledCard
              imageComponent={<img src={IlluPlateforme} alt="" />}
              start={<Tag>Plateforme</Tag>}
              title="Une plateforme pour organiser la diffusion du questionnaire"
              desc="🤳🏼 Paramètrez et partagez vos campagnes de diffusion"
              size="small"
              titleAs="h6"
            />
            <StyledCard
              imageComponent={<img src={IlluDonnees} alt="" />}
              start={<Tag>Plateforme</Tag>}
              title="Une consultation des témoignages recueillis pour chacune des formations"
              desc="⏳ Bientôt, une visualisation poussée et des modules de réutilisation des témoignages"
              size="small"
              titleAs="h6"
            />
            <StyledCard
              imageComponent={<img src={IlluExpo} alt="" />}
              start={<Tag>⏳</Tag>}
              title="Une mise en avant de vos formations auprès des collégien·nes"
              desc="↪ L’exposition des témoignages est en prototypage sur : La bonne alternance, ..."
              size="small"
              titleAs="h6"
            />
          </CardContainer>
          <CFAButtonContainer>
            <Button
              iconId="fr-icon-questionnaire-fill"
              priority="secondary"
              onClick={() =>
                navigate(
                  `/questionnaires/${
                    validatedQuestionnaire?.length && validatedQuestionnaire[0]._id
                  }/apercu`
                )
              }
            >
              Aperçu du questionnaire
            </Button>
            <Button iconId="fr-icon-account-circle-fill" onClick={() => navigate("/inscription")}>
              S'inscrire
            </Button>
          </CFAButtonContainer>
        </CFAContainer>
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
        <ExperimentationAndTestimonyContainer>
          <>
            <h2>
              <span className={fr.cx("fr-icon-quote-fill")} aria-hidden={true} />
              Ce qu’en disent les CFA déjà embarqués
            </h2>
          </>
          <ExpressedTestimonies>
            <img src={IlluCFA} alt="" />
            <p>Témoignages spontanément exprimés par les CFA de cette première expérimentation</p>
          </ExpressedTestimonies>
          <QuotesContainer>
            <img src={IlluCFA} alt="" />
            <div>
              <p>
                « Je n’ai que des retours positifs de mes équipes, est-ce que l’on peut élargir
                l'échantillon ? »
              </p>
              <p>« C’est innovant et précieux ce que vous faites ! »</p>
              <p>« Super outil, facile à prendre en main. »</p>
              <p>
                « Je suis déçue… Mon CFA propose principalement des formations dans le supérieur, ce
                sera bientôt disponible ? »
              </p>
            </div>
          </QuotesContainer>
        </ExperimentationAndTestimonyContainer>
        <NeedHelp />
        <ScrollToTop onClick={() => window.scrollTo(0, 0)}>
          <span className={fr.cx("fr-icon-arrow-up-fill")} aria-hidden={true} />
          <p>Haut de page</p>
        </ScrollToTop>
      </Container>
    </>
  );
};

export default HomePage;
