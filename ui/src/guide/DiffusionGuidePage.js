import { fr } from "@codegouvfr/react-dsfr";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { useState } from "react";
import ReactPlayer from "react-player/file";

import IlluCFA from "../assets/images/illu_cfa.svg";
import IlluDonnees from "../assets/images/illu_donnees.svg";
import IlluExpo from "../assets/images/illu_expo.svg";
import IlluPlateforme from "../assets/images/illu_plateforme.svg";
import IlluQuestionnaire from "../assets/images/illu_questionnaire.svg";
import LogoWithoutText from "../assets/images/logo_without_text.svg";
import video1Questionnaire from "../assets/videos/video1_questionnaire.mp4";
import video2Creation from "../assets/videos/video2_creation.mp4";
import video3Diffusion from "../assets/videos/video3_diffusion.mp4";
import video4Resultats from "../assets/videos/video4_resultats.mp4";
import {
  CardContainer,
  CFAContainer,
  Container,
  ExpressedTestimonies,
  GoalContainer,
  HowToContainer,
  MultipleVideoContainer,
  QuotesContainer,
  StyledCard,
  TestimonyContainer,
  VideoContainer,
} from "./diffusionGuide.style";

const DiffusionGuidePage = () => {
  const [video, setVideo] = useState("questionnaire");

  return (
    <Container>
      <h2>
        Avec Sirius recueillez les témoignages de vos apprenti·es{" "}
        <span style={{ fontWeight: "400" }}>infra-bac pour mieux informer sur la réalité de l'apprentissage</span>
      </h2>
      <GoalContainer>
        <img src={LogoWithoutText} alt="" />
        <section>
          <div>
            <h3>Recueillir</h3>
            <p>
              <b>auprès des 4000 CFA</b> formateurs qui dispensent des formations en apprentissage de{" "}
              <b>niveau infra-bac</b> (périmètre de notre première expérimentation)
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
            onClick={() => setVideo("questionnaire")}
            isClicked={video === "questionnaire"}
          />
          <StyledCard
            imageComponent={<img src={IlluPlateforme} alt="" />}
            start={<Tag>Plateforme</Tag>}
            title="Une plateforme pour organiser la diffusion du questionnaire"
            desc="🤳🏼 Paramètrez et partagez vos campagnes de diffusion"
            size="small"
            titleAs="h6"
            onClick={() => setVideo("plateforme")}
            isClicked={video === "plateforme"}
          />
          <StyledCard
            imageComponent={<img src={IlluDonnees} alt="" />}
            start={<Tag>Plateforme</Tag>}
            title="Une consultation des témoignages recueillis pour chacune des formations"
            desc="⏳ Bientôt, une visualisation poussée et des modules de réutilisation des témoignages"
            size="small"
            titleAs="h6"
            onClick={() => setVideo("plateforme2")}
            isClicked={video === "plateforme2"}
          />
          <StyledCard
            imageComponent={<img src={IlluExpo} alt="" />}
            start={<Tag>⏳</Tag>}
            title="Une mise en avant de vos formations auprès des collégien·nes"
            desc="↪ L’exposition des témoignages est en prototypage sur : La bonne alternance, ..."
            size="small"
            titleAs="h6"
            notClickable={true}
          />
        </CardContainer>
        <VideoContainer>
          {video === "questionnaire" && (
            <>
              <h5>ZOOM: Un questionnaire anonyme pour interroger vos apprenti·es</h5>
              <ReactPlayer url={video1Questionnaire} controls={true} />
            </>
          )}
          {video === "plateforme" && (
            <>
              <h5>ZOOM: Une plateforme pour organiser la diffusion du questionnaire</h5>
              <MultipleVideoContainer>
                <ReactPlayer url={video2Creation} controls={true} />
                <ReactPlayer url={video3Diffusion} controls={true} />
              </MultipleVideoContainer>
            </>
          )}
          {video === "plateforme2" && (
            <>
              <h5>ZOOM: Une consultation des témoignages recueillis pour chacune des formations</h5>
              <ReactPlayer url={video4Resultats} controls={true} />
            </>
          )}
        </VideoContainer>
      </CFAContainer>
      <HowToContainer></HowToContainer>
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
            <p>« Je n’ai que des retours positifs de mes équipes, est-ce que l’on peut élargir l'échantillon ? »</p>
            <p>« C’est innovant et précieux ce que vous faites ! »</p>
            <p>« Super outil, facile à prendre en main. »</p>
            <p>
              « Je suis déçue… Mon CFA propose principalement des formations dans le supérieur, ce sera bientôt
              disponible ? »
            </p>
          </div>
        </QuotesContainer>
      </TestimonyContainer>
    </Container>
  );
};
export default DiffusionGuidePage;
