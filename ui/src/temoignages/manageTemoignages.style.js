import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

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

export const ManageTemoignagesContainer = styled.section`
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

export const ToolTipContainer = styled.p`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 140px;
`;

export const ActionsContainer = styled.div`
  display: flex;
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 4rem;
  margin: ${fr.spacing("4w")} auto;
  padding: 0 ${fr.spacing("4w")};

  & > div {
    width: calc(50% - 2rem);
    min-width: 500px;
  }
`;

export const DeleteButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
  width: 100%;

  & fieldset {
    margin-bottom: 0;
  }
`;
