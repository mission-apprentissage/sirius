import happyFace from "../../assets/icons/happy-face-fill-green.svg";
import mediumFace from "../../assets/icons/normal-face-fill-blue.svg";
import sadFace from "../../assets/icons/sad-face-fill-orange.svg";
import { BadRating, ExperienceRatingContainer, GoodRating, MediumRating, Rating } from "../IframeFormation.style";

const ExperienceRating = ({ rating }) => {
  if (!rating) return null;
  return (
    <ExperienceRatingContainer>
      <p>Les apprenti·es disent que ça se passe</p>
      <div>
        <Rating>
          <img src={happyFace} alt="" />
          <GoodRating>
            Bien <br /> <span>{rating.Bien}%</span>
          </GoodRating>
        </Rating>
        <Rating>
          <img src={mediumFace} alt="" />
          <MediumRating>
            Moyen <br /> <span>{rating.Moyen}%</span>
          </MediumRating>
        </Rating>
        <Rating>
          <img src={sadFace} alt="" />
          <BadRating>
            Mal <br /> <span>{rating.Mal}%</span>
          </BadRating>
        </Rating>
      </div>
      <p>Voici le détail de leur expérience : du plus simple ① au plus difficile à vivre ⑥</p>
    </ExperienceRatingContainer>
  );
};

export default ExperienceRating;
