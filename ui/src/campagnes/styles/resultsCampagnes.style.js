import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const Container = styled.section`
  margin: ${fr.spacing("8w")} auto 0 auto;

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
    padding: 0 ${fr.spacing("12w")};

    ${fr.breakpoints.only("xs")} {
      padding: 0 ${fr.spacing("4w")};
    }
  }
`;

export const ResultsCampagneContainer = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 78em;
  margin: auto;
  padding: ${fr.spacing("6w")} 1.5rem;
`;

export const TestimonialHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${fr.spacing("6w")};

  & h1 {
    margin: 0;
  }

  & span {
    margin-right: 0.5rem;
  }

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const VerbatimsContainer = styled.div`
  padding: ${fr.spacing("6w")} 0;
  border-top: 2px solid #e7e7e7;

  & > p:first-of-type {
    font-size: 20px;
    line-height: 1.5;
  }
`;

export const MasonryItemContainer = styled.div`
  margin: ${fr.spacing("1w")} 0;
  padding-bottom: ${fr.spacing("4w")};
  border-bottom: 2px solid #e7e7e7;

  & > img {
    margin-bottom: ${fr.spacing("1w")};
  }
`;
