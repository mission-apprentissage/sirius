import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const Container = styled.section`
  margin: ${fr.spacing("4w")} auto 0 auto;

  & > div {
    max-width: 78rem;
    margin: auto;
    padding: 0 ${fr.spacing("3w")};
    margin: ${fr.spacing("4w")} auto;
  }

  & h1 {
    text-align: left;
    color: var(--text-active-blue-france);
    margin: ${fr.spacing("1w")} 0;
  }
`;

export const ExperimentationAndTestimonyContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${fr.spacing("8w")} ${fr.spacing("12w")};
  text-align: center;
  background-color: var(--background-alt-blue-france);

  ${fr.breakpoints.only("xs")} {
    padding: ${fr.spacing("4w")};
  }

  & > div {
    ${fr.breakpoints.only("xl")} {
      max-width: 78rem;
      margin: auto;
      padding: 0 ${fr.spacing("3w")};
      margin: ${fr.spacing("4w")} auto;
    }
  }

  & h2 {
    margin-bottom: ${fr.spacing("1w")};

    & span {
      margin-right: ${fr.spacing("1w")};
    }
  }

  & > p {
    font-size: 14px;
  }
`;

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: ${fr.spacing("4w")} auto;
  flex-wrap: wrap;
  width: 100%;

  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;

    ${fr.breakpoints.up("md")} {
      width: 25%;
    }
  }
`;
