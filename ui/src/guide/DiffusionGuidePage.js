import React, { useState } from "react";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { fr } from "@codegouvfr/react-dsfr";
import ReactPlayer from "react-player/file";
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
} from "./diffusionGuide.style";
import LogoWithoutText from "../assets/images/logo_without_text.svg";
import IlluQuestionnaire from "../assets/images/illu_questionnaire.svg";
import IlluPlateforme from "../assets/images/illu_plateforme.svg";
import IlluDonnees from "../assets/images/illu_donnees.svg";
import IlluExpo from "../assets/images/illu_expo.svg";
import IlluCFA from "../assets/images/illu_cfa.svg";
import sampleVideo from "../assets/videos/sample.mp4";
import sample2Video from "../assets/videos/sample2.mp4";

const DiffusionGuidePage = () => {
  const [video, setVideo] = useState("questionnaire");

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
            onMouseEnter={() => setVideo("questionnaire")}
          />
          <StyledCard
            imageComponent={<img src={IlluPlateforme} alt="" />}
            start={<Tag>Plateforme</Tag>}
            title="Une plateforme pour organiser la diffusion du questionnaire"
            desc="🤳🏼 Paramètrez et partagez vos campagnes de diffusion"
            size="small"
            titleAs="h6"
            onMouseEnter={() => setVideo("plateforme")}
          />
          <StyledCard
            imageComponent={<img src={IlluDonnees} alt="" />}
            start={<Tag>Plateforme</Tag>}
            title="Une consultation des témoignages recueillis pour chacune des formations"
            desc="⏳ Bientôt, une visualisation poussée et des modules de réutilisation des témoignages"
            size="small"
            titleAs="h6"
            onMouseEnter={() => setVideo("plateforme2")}
          />
          <StyledCard
            imageComponent={<img src={IlluExpo} alt="" />}
            start={<Tag>⏳</Tag>}
            title="Une mise en avant de vos formations auprès des collégien·nes"
            desc="↪ L’exposition des témoignages est en prototypage sur : La bonne alternance, ..."
            size="small"
            titleAs="h6"
            onMouseEnter={() => setVideo("miseEnAvant")}
          />
        </CardContainer>
      </CFAContainer>
      <HowToContainer>
        {video === "questionnaire" && (
          <>
            <h5>FOCUS: Un questionnaire anonyme pour interroger vos apprenti·es</h5>
            <ReactPlayer url={sampleVideo} controls={true} attributes />
          </>
        )}
        {video === "plateforme" && (
          <>
            <h5>FOCUS: Une plateforme pour organiser la diffusion du questionnaire</h5>
            <ReactPlayer url={sample2Video} controls={true} attributes />
          </>
        )}
        {video === "plateforme2" && (
          <>
            <h5>FOCUS: Une consultation des témoignages recueillis pour chacune des formations</h5>
            <ReactPlayer url={sampleVideo} controls={true} attributes />
          </>
        )}
        {video === "miseEnAvant" && (
          <>
            <h5>FOCUS: Une mise en avant de vos formations auprès des collégien·nes</h5>
            <ReactPlayer url={sample2Video} controls={true} attributes />
          </>
        )}
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
