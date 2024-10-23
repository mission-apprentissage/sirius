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

export const CreateCampagneContainer = styled.section`
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

  & .fr-collapse {
    padding: 0;
  }
`;

export const StepContainer = styled.div`
  margin: ${fr.spacing("6w")} 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${fr.spacing("2w")};
  margin-top: 1rem;
`;
