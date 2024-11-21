import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const IframeContainer = styled.main`
  max-width: 800px;
  padding: 0;

  & > p {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 16px;
  }
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
  padding: 20px 40px;
  border-left: 1px solid var(--border-open-blue-france);
  border-right: 1px solid var(--border-open-blue-france);
`;

export const GemContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  min-height: 100px;

  & span {
    margin-right: 5px;
  }
`;

export const ExperienceRatingContainer = styled.div`
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  & p {
    text-align: left;
  }
`;

export const GoodRating = styled.p`
  color: var(--background-flat-success) !important;
  font-weight: bold;

  & span {
    font-size: 20px;
  }
`;

export const MediumRating = styled.p`
  color: var(--background-flat-info) !important;
  font-weight: bold;

  & span {
    font-size: 20px;
  }
`;

export const BadRating = styled.p`
  color: #fa7a35 !important;
  font-weight: bold;

  & span {
    font-size: 20px;
  }
`;

export const FeelingRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-open-blue-france);
  border-radius: 0 0 40px 40px;
  gap: 1rem;
  padding: ${fr.spacing("2w")} 0;

  p {
    text-align: center;
    margin-bottom: 0;
  }
`;

export const ExperienceVerbatimsContainer = styled.div`
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
  justify-content: center;
  gap: 7rem;
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

export const FeelingRatingLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;

  & a {
    color: var(--text-action-high-blue-france);
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding: 16px 0;
  width: 100%;

  ${fr.breakpoints.down("sm")} {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: 1rem;
  }

  & h3 {
    margin: 0;
  }
`;

export const ConstructionNotice = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--background-action-low-blue-france);
  padding: 12px;
  gap: 8px;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 100%;

  & span {
    color: var(--background-flat-blue-france);
  }

  & p {
    margin: 0;
    line-height: 24px;
    font-size: 14px;
  }
`;
