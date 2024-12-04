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

export const ManageJobsContainer = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 78em;
  margin: auto;
  padding: ${fr.spacing("6w")} 1.5rem;

  & > p {
    margin: 0;
  }

  & h1 {
    margin: 0 0 ${fr.spacing("2w")} 0;
  }

  & span {
    margin-right: 0.5rem;
  }
`;

export const TriggerJobContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${fr.spacing("4w")};
  padding: ${fr.spacing("2w")} 0;
`;
