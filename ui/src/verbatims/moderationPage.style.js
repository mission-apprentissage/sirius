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

export const ModerationContainer = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 78em;
  margin: auto;
  padding: ${fr.spacing("6w")} 1.5rem;
  gap: ${fr.spacing("2w")};

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

export const SelectorsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;

  & div {
    width: 100%;
  }
`;

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 100px;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  jutify-content: center;
  gap: 1rem;
  width: 100%;

  & .fr-table > table {
    width: 100%;
  }

  & .fr-alert {
    width: 100%;
  }
`;

export const FormationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 120px;

  & p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const QuestionKeyContainer = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
`;

export const ScoresContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 120px;
`;

export const ModerationActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;

  & > div {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
  }
`;

export const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 400px;
`;
