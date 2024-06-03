import {
  ExperienceEntrepriseRatingContainer,
  Rating,
  MediumRating,
  BadRating,
  GoodRating,
} from "../IframeFormation.style";
import happyFace from "../../assets/icons/happy-face-fill-green.svg";
import mediumFace from "../../assets/icons/normal-face-fill-blue.svg";
import sadFace from "../../assets/icons/sad-face-fill-orange.svg";

const ExperienceEntrepriseRating = ({ rating }) => {
  return (
    <ExperienceEntrepriseRatingContainer>
      <div>
        <Rating>
          <p>
            <img src={happyFace} alt="" /> Bien
          </p>
          <p>
            pour{" "}
            <GoodRating>
              <b>{rating.Bien}/10</b>
            </GoodRating>
          </p>
        </Rating>
        <Rating>
          <p>
            <img src={mediumFace} alt="" />
            Moyen
          </p>
          <p>
            pour{" "}
            <MediumRating>
              <b>{rating.Moyen}/10</b>
            </MediumRating>
          </p>
        </Rating>
        <Rating>
          <p>
            <img src={sadFace} alt="" />
            Mal
          </p>
          <p>
            pour{" "}
            <BadRating>
              <b>{rating.Mal}/10</b>
            </BadRating>
          </p>
        </Rating>
      </div>
      <p>Voici le détail de leur expérience : du plus simple ① au plus difficile à vivre ⑤</p>
    </ExperienceEntrepriseRatingContainer>
  );
};

export default ExperienceEntrepriseRating;
