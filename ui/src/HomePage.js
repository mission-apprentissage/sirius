import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { loadDynamicStyle, unloadStyle } from "./utils/style";
import { useGet } from "./common/hooks/httpHooks";
import LogoWithoutText from "./assets/images/logo_without_text.svg";
import IlluQuestionnaire from "./assets/images/illu_questionnaire.svg";
import IlluPlateforme from "./assets/images/illu_plateforme.svg";
import IlluDonnees from "./assets/images/illu_donnees.svg";
import IlluExpo from "./assets/images/illu_expo.svg";

const Container = styled.section`
  margin: ${fr.spacing("8w")} auto;

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
    padding: 0 ${fr.spacing("12w")};

    ${fr.breakpoints.only("xs")} {
      padding: 0 ${fr.spacing("4w")};
    }
  }
`;

const GoalContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${fr.spacing("12w")};
  margin-bottom: ${fr.spacing("12w")};

  ${fr.breakpoints.only("xs")} {
    padding: 0 ${fr.spacing("4w")};
  }

  & img {
    max-width: 200px;
  }

  & section {
    display: flex;
    flex-direction: row;
    margin: ${fr.spacing("2w")} auto;
    width: 80%;

    ${fr.breakpoints.down("md")} {
      width: 100%;
    }

    & div {
      width: 50%;

      &:first-of-type {
        text-align: right;
        margin-right: ${fr.spacing("8w")};
        color: #000091;

        ${fr.breakpoints.down("md")} {
          margin-right: ${fr.spacing("4w")};
        }

        h3 {
          color: #000091;
        }
      }

      &:nth-of-type(2) {
        text-align: left;
        margin-left: ${fr.spacing("8w")};
        color: #f95c5e;

        ${fr.breakpoints.down("md")} {
          margin-left: ${fr.spacing("4w")};
        }

        h3 {
          color: #f95c5e;
        }
      }
    }
  }
`;

const CFAContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${fr.spacing("12w")};
  background-color: var(--background-alt-blue-france);

  ${fr.breakpoints.only("xs")} {
    padding: 0 ${fr.spacing("4w")};
  }

  & p {
    margin-top: ${fr.spacing("8w")};
  }

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  width: 100%;
`;

const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  border-bottom: 3px solid black;
  margin: ${fr.spacing("2w")};
  text-align: center;

  ${fr.breakpoints.up("sm")} {
    width: 100%;
  }

  ${fr.breakpoints.up("md")} {
    width: calc(50% - ${fr.spacing("2w")} * 2);
  }

  ${fr.breakpoints.up("lg")} {
    width: calc(25% - ${fr.spacing("2w")} * 2);
  }

  & img {
    margin-top: ${fr.spacing("4w")};
  }

  & span {
    background-color: var(--artwork-decorative-purple-glycine);
    color: var(--text-action-high-purple-glycine);
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: ${fr.spacing("2w")};
  }

  & .fr-card__footer {
    display: none;

    ${fr.breakpoints.down("md")} {
      display: inline-block;
    }
  }
`;

const CFAButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: ${fr.spacing("8w")} auto;

  & button {
    margin: 0 ${fr.spacing("2w")};
  }

  & button:first-of-type {
    display: flex;

    ${fr.breakpoints.down("md")} {
      display: none;
    }
  }
`;

const Homepage = () => {
  const navigate = useNavigate();
  const [questionnaires] = useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  useEffect(() => {
    const styleLink = loadDynamicStyle("/dsfr/dsfr.min.css");

    return () => {
      unloadStyle(styleLink);
    };
  }, []);

  return (
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
      <CFAContainer>
        <p>Vous êtes un CFA ?</p>
        <h2>Sirius entre vos mains, c’est :</h2>
        <CardContainer>
          <StyledCard
            imageComponent={<img src={IlluQuestionnaire} />}
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
            imageComponent={<img src={IlluPlateforme} />}
            start={<Tag>Plateforme</Tag>}
            title="Une plateforme pour organiser la diffusion du questionnaire"
            desc="🤳🏼 Paramètrez et partagez vos campagnes de diffusion"
            size="small"
            titleAs="h6"
          />
          <StyledCard
            imageComponent={<img src={IlluDonnees} />}
            start={<Tag>Plateforme</Tag>}
            title="Une consultation des témoignages recueillis pour chacune des formations"
            desc="⏳ Bientôt, une visualisation poussée et des modules de réutilisation des témoignages"
            size="small"
            titleAs="h6"
          />
          <StyledCard
            imageComponent={<img src={IlluExpo} />}
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
    </Container>
  );
};
export default Homepage;
