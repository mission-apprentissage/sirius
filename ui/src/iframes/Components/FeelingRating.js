import cloudFillBlue from "../../assets/icons/cloud-fill-blue.svg";
import stormFillOrange from "../../assets/icons/storm-fill-orange.svg";
import sunFillGreen from "../../assets/icons/sun-fill-green.svg";
import {
  BadRating,
  FeelingRatingContainer,
  FeelingRatingLinks,
  GoodRating,
  MediumRating,
  Rating,
  RatingWeatherContainer,
} from "../IframeFormation.style";

const FeelingRating = ({ rating, isFormation = false, isEtablissement = false }) => {
  if (!rating) return null;
  return (
    <FeelingRatingContainer>
      {isFormation && <p>Voici leur ressenti sur la recherche d’entreprise dans ce domaine</p>}
      {isEtablissement && <p>Voici leur ressenti sur le soutien de l’équipe pédagogique</p>}
      <RatingWeatherContainer>
        <Rating>
          <img src={sunFillGreen} alt="" />
          <GoodRating>
            Bien <br /> <span>{rating.Bien}%</span>
          </GoodRating>
        </Rating>
        <Rating>
          <img src={cloudFillBlue} alt="" />
          <MediumRating>
            Moyen <br /> <span>{rating.Moyen}%</span>
          </MediumRating>
        </Rating>
        <Rating>
          <img src={stormFillOrange} alt="" />
          <BadRating>
            Mal <br /> <span>{rating.Mal}%</span>
          </BadRating>
        </Rating>
      </RatingWeatherContainer>
      {isFormation ? (
        <FeelingRatingLinks>
          <a
            href="https://www.onisep.fr/vers-l-emploi/alternance/apprentissage-conseils-pour-obtenir-un-contrat/comment-trouver-la-bonne-entreprise"
            target="_blank"
            rel="noreferrer"
          >
            Conseils d’apprenti·es
          </a>
          <a href="https://labonnealternance.apprentissage.beta.gouv.fr/" target="_blank" rel="noreferrer">
            Trouver mon entreprise
          </a>
        </FeelingRatingLinks>
      ) : null}
    </FeelingRatingContainer>
  );
};

export default FeelingRating;
