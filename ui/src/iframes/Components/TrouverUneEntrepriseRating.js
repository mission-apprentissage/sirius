import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";

import community from "../../assets/images/community.svg";
import didYouKnow from "../../assets/images/didYouKnow.svg";
import house from "../../assets/images/house.svg";
import locationFrance from "../../assets/images/location-france.svg";
import school from "../../assets/images/school-small.svg";
import search from "../../assets/images/search.svg";
import selfTraining from "../../assets/images/self-training.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import useMatomoEvent from "../../hooks/useMatomoEvent";
import { MATOMO_ACTION, MATOMO_CATEGORY } from "../../matomo";
import {
  CardsContainer,
  DidYouKnowContainer,
  Position,
  TrouverEntrepriseCardContainer,
  TrouverUneEntrepriseRatingContainer,
} from "./shared.style";

const getTrouverEntrepriseIcon = (label) => {
  switch (label) {
    case "En toute autonomie":
      return <img src={selfTraining} alt="" />;
    case "Avec l’aide de l’entourage (famille, amis, etc)":
      return <img src={house} alt="" />;
    case "Avec l’aide du CFA":
    case "Avec l’aide de l’ancien établissement":
      return <img src={school} alt="" />;
    case "Autrement (non précisé)":
      return <img src={search} alt="" />;
    case "Avec l’aide d’un éducateur ou d’une association":
      return <img src={community} alt="" />;
    case "Lors d'un événement sur l’orientation":
      return <img src={locationFrance} alt="" />;
  }
};

const TrouverEntrepriseCard = ({ percentage, count, label, position, seeMore }) => {
  const { isMobile } = useBreakpoints();
  const icon = getTrouverEntrepriseIcon(label);
  if (position > 3 && !seeMore) return null;
  return (
    <TrouverEntrepriseCardContainer isMobile={isMobile}>
      {position <= 3 && <Position>{position}</Position>}
      {icon}
      <h5>
        {percentage}% <span>({count})</span>
      </h5>
      <p>{label}</p>
    </TrouverEntrepriseCardContainer>
  );
};

const TrouverUneEntrepriseRating = ({ data, etablissementsCount, intituleFormation }) => {
  const [seeMore, setSeeMore] = useState(false);
  const trackEvent = useMatomoEvent();

  return (
    <TrouverUneEntrepriseRatingContainer>
      <div>
        <h3>Pour trouver une entreprise</h3>
        <DidYouKnowContainer>
          <img src={didYouKnow} alt="" />
          <div>
            <h6>Le savais-tu ?</h6>
            <p>
              C’est le rôle du CFA de t’accompagner dans ton intégration et tes premiers pas dans le monde
              professionnel. N’hésite pas à le contacter pour trouver une entreprise !
            </p>
            <p>
              Les entreprises qui recrutent sont aussi sur{" "}
              <a href="https://labonnealternance.apprentissage.beta.gouv.fr/" target="_blank" rel="noreferrer">
                La bonne alternance
              </a>
            </p>
          </div>
        </DidYouKnowContainer>
      </div>
      <p>Pour cette formation, les apprentis ont trouvé une entreprise : </p>
      <CardsContainer>
        {data?.map((item, index) => (
          <TrouverEntrepriseCard key={item.label} {...item} position={index + 1} seeMore={seeMore} />
        ))}
      </CardsContainer>
      <p
        onClick={() => {
          trackEvent(
            MATOMO_CATEGORY.IFRAME_FORMATION,
            seeMore ? MATOMO_ACTION.CLICK_TROUVER_ENTREPRISE_SEE_LESS : MATOMO_ACTION.CLICK_TROUVER_ENTREPRISE_SEE_MORE,
            null,
            intituleFormation
          );
          setSeeMore((prevValue) => !prevValue);
        }}
      >
        {seeMore ? "Voir moins" : "Voir plus"}{" "}
        <span className={fr.cx(seeMore ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
      </p>
    </TrouverUneEntrepriseRatingContainer>
  );
};

export default TrouverUneEntrepriseRating;
