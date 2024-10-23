import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const Container = styled.main`
  margin: 0 auto;

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
    padding: 0 ${fr.spacing("12w")};

    ${fr.breakpoints.only("xs")} {
      padding: 0 ${fr.spacing("4w")};
    }
  }
`;

export const ManageCampagneContainer = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 78em;
  margin: auto;
  padding: ${fr.spacing("6w")} 1.5rem;

  & > div:first-of-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${fr.spacing("6w")};
    margin: 0 0 ${fr.spacing("5w")} 0;
  }

  & h1 {
    margin: 0;
  }

  & span {
    margin-right: 0.5rem;
  }

  & .fr-collapse {
    padding: 0;
  }

  & > p:last-of-type {
    margin-top: ${fr.spacing("6w")};
  }
`;
