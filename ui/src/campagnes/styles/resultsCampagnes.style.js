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
  padding: 0 ${fr.spacing("2w")} ${fr.spacing("6w")} ${fr.spacing("2w")};
  margin: auto;
  max-width: 78em;

  & span {
    margin-right: 0.5rem;
  }
`;

export const TestimonialHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: ${fr.spacing("6w")} 0;

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

export const FullWidthContainer = styled.div`
  width: 100%;
  padding: ${fr.spacing("4w")};
  background-color: white;

  & > p:first-of-type {
    font-size: 20px;
    line-height: 1.5;
  }

  & > div {
    height: 300px;
  }
`;

export const FullWidthVerbatimContainer = styled.div`
  padding: ${fr.spacing("4w")} 0;
  margin-top: ${fr.spacing("6w")};
  border-top: 2px solid #e7e7e7;
  width: 100%;

  & > p:first-of-type {
    font-size: 20px;
    line-height: 1.5;
  }
`;

export const MasonryItemContainer = styled.div`
  margin: ${fr.spacing("1w")} ${fr.spacing("2w")};
  padding-bottom: ${fr.spacing("4w")};
  border-bottom: 2px solid #e7e7e7;

  & > img {
    margin-bottom: ${fr.spacing("1w")};
  }
`;

export const HalfWidthContainer = styled.div`
  width: 50%;
  padding: ${fr.spacing("4w")};
  background-color: white;

  ${fr.breakpoints.down("lg")} {
    width: 100%;
  }

  & > p:first-of-type {
    font-size: 20px;
    line-height: 1.5;
  }

  & > div {
    height: 300px;
  }
`;

export const DataVizContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  margin-top: ${fr.spacing("4w")};
`;
