import {
  GoodRatingWeather,
  MediumRatingWeather,
  BadRatingWeather,
  SearchEntrepriseRatingContainer,
  RatingWeatherContainer,
  SearchEntrepriseRatingLinks,
} from "../IframeFormation.style";
import sunFillGreen from "../../assets/icons/sun-fill-green.svg";
import cloudLineBlue from "../../assets/icons/cloud-line-blue.svg";
import stormLineOrange from "../../assets/icons/storm-line-orange.svg";

const SearchEntrepriseRating = ({ rating }) => {
  return (
    <SearchEntrepriseRatingContainer>
      <p>Voici leur ressenti sur la recherche d’entreprise dans ce domaine</p>
      <RatingWeatherContainer>
        <GoodRatingWeather>
          <div>
            {Array.from({ length: rating.Bien }).map((_, index) => (
              <img src={sunFillGreen} key={index} />
            ))}
          </div>
          <p>
            <b>Bien</b> pour <span>{rating.Bien}/10</span>
          </p>
        </GoodRatingWeather>
        <MediumRatingWeather>
          <div>
            {Array.from({ length: rating.Moyen }).map((_, index) => (
              <img src={cloudLineBlue} key={index} />
            ))}
          </div>
          <p>
            <b>Moyen</b> pour <span>{rating.Moyen}/10</span>
          </p>
        </MediumRatingWeather>
        <BadRatingWeather>
          <div>
            {Array.from({ length: rating.Mal }).map((_, index) => (
              <img src={stormLineOrange} key={index} />
            ))}
          </div>
          <p>
            <b>Mal</b> pour <span>{rating.Mal}/10</span>
          </p>
        </BadRatingWeather>
      </RatingWeatherContainer>
      <SearchEntrepriseRatingLinks>
        <a
          href="https://www.onisep.fr/vers-l-emploi/alternance/apprentissage-conseils-pour-obtenir-un-contrat/comment-trouver-la-bonne-entreprise"
          target="_blank"
          rel="noreferrer"
        >
          Conseils d’apprenti·es
        </a>
        <a
          href="https://labonnealternance.apprentissage.beta.gouv.fr/"
          target="_blank"
          rel="noreferrer"
        >
          Trouver mon entreprise
        </a>
      </SearchEntrepriseRatingLinks>
    </SearchEntrepriseRatingContainer>
  );
};

export default SearchEntrepriseRating;
