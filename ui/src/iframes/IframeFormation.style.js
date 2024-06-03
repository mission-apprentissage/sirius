import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const IframeContainer = styled.main`
  width: 720px;
`;

export const DatavisualisationContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TestimonialsCount = styled.div`
  border-radius: 20px 20px 0 0;
  width: 100%;
  border: 1px solid var(--border-open-blue-france);
  background-color: var(--background-open-blue-france);

  & p {
    text-align: center;
    margin: 15px auto;
    max-width: 75%;
  }
`;

export const GemVerbatimContainer = styled.div`
  background: linear-gradient(-90deg, #ffffff, #ececfe);
  width: 100%;
  padding: 10px 40px;
  border: 1px solid var(--border-open-blue-france);

  & > p {
    text-align: center;
    color: var(--text-action-high-blue-france);
    cursor: pointer;
    font-weight: 500;
  }
`;

export const GemContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-height: 200px;

  & span {
    margin-right: 5px;
  }
`;

export const ExperienceEntrepriseRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-open-blue-france);
  border-right: 1px solid var(--border-open-blue-france);

  gap: 1rem;
  padding: ${fr.spacing("2w")} 0;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 7rem;
    width: 100%;
  }

  & p {
    text-align: center;
    margin: 0;
    color: var(--text-mention-grey);
  }
`;

export const Rating = styled.div`
  & p:first-of-type {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    margin-bottom: 0;
  }

  & p:last-of-type {
    margin-top: 0;
  }
`;

export const GoodRating = styled.span`
  color: var(--background-flat-success);
`;

export const MediumRating = styled.span`
  color: var(--background-flat-info);
`;

export const BadRating = styled.span`
  color: #fa7a35;
`;

export const SearchEntrepriseRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-open-blue-france);
  gap: 1rem;
  padding: ${fr.spacing("2w")} 0;

  p {
    text-align: center;
    margin-bottom: 0;
  }
`;

export const ExperienceEntrepriseVerbatimsContainer = styled.div`
  border-left: 1px solid var(--border-open-blue-france);
  border-right: 1px solid var(--border-open-blue-france);

  & button {
    color: var(--background-flat-grey);
  }
`;

export const CircledNumber = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  width: 25px;
  height: 25px;
  line-height: 30px;
  text-align: center;
  border: 1px solid black;
  border-radius: 50%;
  font-size: 16px;
`;

export const OtherVerbatim = styled.p`
  color: var(--text-action-high-blue-france);
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
`;

export const VerbatimContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  width: 90%;
  margin: 0 auto;

  & p {
    margin-bottom: 0;
  }
`;

export const RatingWeatherContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1rem;
  padding: 1rem 0;
  text-align: center;

  & div > div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const GoodRatingWeather = styled.div`
  & span {
    color: var(--background-flat-success);
    font-weight: bold;
  }
`;

export const MediumRatingWeather = styled.div`
  & span {
    color: var(--background-flat-info);
    font-weight: bold;
  }
`;

export const BadRatingWeather = styled.div`
  & span {
    color: #fa7a35;
    font-weight: bold;
  }
`;

export const SearchEntrepriseRatingLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  border-radius: 0 0 20px 20px;

  & a {
    color: var(--text-action-high-blue-france);
  }
`;
