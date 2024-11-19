import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const CarouselContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
`;

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export const VerbatimContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  width: ${(props) => (props.isDesktop ? "70%" : "100%")};
  margin: 16px auto 32px auto;
  padding: 0 16px;

  & p {
    margin-bottom: 0;
  }
`;

export const VerbatimContent = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #161616;

  & span {
    color: var(--text-title-blue-france);
    cursor: pointer;
    text-decoration: underline;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const ApprentiInfo = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: #666666;
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  text-align: center;

  & p {
    margin: 0 1rem;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  & h6 {
    margin-bottom: 0;
  }
`;

export const AccordionTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
`;

export const ExperienceEnEntrepriseRatingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin: 32px auto 016px auto;
  width: 100%;

  ${fr.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  & > div:first-of-type {
    display: flex;
    flex-direction: column;
  }

  & h4 {
    margin-bottom: 0;
  }

  & p {
    margin-bottom: 0;
    font-size: 14px;
  }
`;

export const ExperienceEnEntrepriseRatingChartsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
