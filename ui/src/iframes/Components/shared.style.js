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
  margin-top: 16px;
`;

export const VerbatimContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin: 16px auto 0px auto;
  padding: 24px 16px;
  border: 1px solid var(--border-default-grey);
  min-height: ${({ isMobile }) => (isMobile ? "400px;" : "260px")};

  & p {
    margin-bottom: 0;
  }
`;

export const VerbatimContent = styled.p`
  font-weight: 400;
  font-size: ${({ isMobile }) => (isMobile ? "14px" : "16px")};
  line-height: 24px;
  color: #161616;

  & span {
    color: var(--text-title-blue-france);
    cursor: pointer;
    text-decoration: underline;
    font-weight: 400;
    font-size: ${({ isMobile }) => (isMobile ? "12px" : "14px")};
    line-height: 20px;
  }
`;

export const ApprentiInfo = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: #666666;
  width: 100%;
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
  margin: 32px auto 16px auto;
  width: 100%;

  ${fr.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin: 32px auto 32px auto;
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

export const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  font-size: 12px;
  color: var(--text-title-blue-france);
  cursor: pointer;
`;

export const ThemeLabel = styled.p`
  display: flex;
  flex-direction: ${({ isMobile }) => (isMobile ? "column" : "row")};
  justify-content: flex-start;
  align-items: ${({ isMobile }) => (isMobile ? "flex-start" : "center")};
  gap: 0.5rem;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-title-blue-france);
`;

export const SeeMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ isMobile }) => (isMobile ? "center" : "flex-start")};
  align-items: flex-start;
  padding: 32px 32px 0 32px;
  margin: 16px auto 0 auto;
  border: 1px solid var(--border-default-grey);
  cursor: pointer;
  background-color: var(--background-alt-blue-france);
  min-height: ${({ isMobile }) => (isMobile ? "calc(400px + 16px)" : "calc(260px + 16px)")};
  color: #161616;

  & span {
    width: 26px;
    margin-bottom: 8px;
  }

  & h6 {
    margin: 8px 0 4px 0;
  }

  & div {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 64px;

    & span {
      color: var(--text-title-blue-france);
    }
  }
`;
