import React from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { fr } from "@codegouvfr/react-dsfr";
import {
  Container,
  GoalContainer,
  CFAContainer,
  CardContainer,
  StyledCard,
  TestimonyContainer,
  QuotesContainer,
  ExpressedTestimonies,
  HowToContainer,
  StepContainer,
  SharePicturesContainer,
} from "./diffusionGuide.style";
import LogoWithoutText from "../assets/images/logo_without_text.svg";
import IlluQuestionnaire from "../assets/images/illu_questionnaire.svg";
import IlluPlateforme from "../assets/images/illu_plateforme.svg";
import IlluDonnees from "../assets/images/illu_donnees.svg";
import IlluExpo from "../assets/images/illu_expo.svg";
import IlluCFA from "../assets/images/illu_cfa.svg";
import Share1 from "../assets/images/share_1.png";
import Share2 from "../assets/images/share_2.png";
import Share3 from "../assets/images/share_3.png";
import Button from "@codegouvfr/react-dsfr/Button";

const DiffusionGuidePage = () => {
  const navigate = useNavigate();
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
      </GoalContainer>
      <CFAContainer>
        <h2>Sirius entre vos mains, c’est :</h2>
        <CardContainer>
          <StyledCard
            imageComponent={<img src={IlluQuestionnaire} alt="" />}
            start={<Tag>Questionnaire</Tag>}
            title="Un questionnaire anonyme pour interroger vos apprenti·es"
            desc="💬 Recueillez des témoignages qui reflètent leurs expériences vécues"
            size="small"
            titleAs="h6"
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
      </CFAContainer>
      <HowToContainer>
        <h3>
          <b>FOCUS :</b> Une plateforme pour organiser la diffusion du questionnaire
        </h3>
        <StepContainer>
          <span>①</span>
          <p>
            Pour commencer, sélectionnez les formations auxquelles vous souhaitez faire passer le
            questionnaire Sirius. Pour cela, rendez-vous sur la page <u>Créer des campagnes</u>
          </p>
        </StepContainer>
        <StepContainer>
          <span>②</span>
          <p>
            Retrouvez-les dans votre tableau sur la page <u>Diffuser mes campagnes</u>
          </p>
        </StepContainer>
        <StepContainer>
          <span>③</span>
          <p>Sélectionnez celles que vous voulez diffuser à vos apprenti·es</p>
        </StepContainer>
        <StepContainer>
          <span>④</span>
          <Button iconId="fr-icon-file-download-line">Partager</Button>
        </StepContainer>
        <StepContainer>
          <span>⑤</span>
          <p>
            Nous générons un PDF à partir de votre sélection pour vous aider à gérer la diffusion :
          </p>
        </StepContainer>
        <SharePicturesContainer>
          <div>
            <p>
              <b>Un sommaire</b> (pour vous)
            </p>
            <img src={Share1} alt="" />
          </div>
          <div>
            <p>
              <b>Sirius c'est quoi ?</b> (pour eux)
            </p>
            <img src={Share2} alt="" />
          </div>
          <div>
            <p>
              <b>Le pas à pas et son QR code</b> (pour eux)
            </p>
            <img src={Share3} alt="" />
          </div>
        </SharePicturesContainer>
        <Button iconId="fr-icon-add-line" onClick={() => navigate("/campagnes/ajout")}>
          Créer des campagnes
        </Button>
      </HowToContainer>
      <TestimonyContainer>
        <h2>
          <span className={fr.cx("fr-icon-quote-fill")} aria-hidden={true} />
          Ce qu’en disent les CFA déjà embarqués
        </h2>
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
      </TestimonyContainer>
    </Container>
  );
};
export default DiffusionGuidePage;
