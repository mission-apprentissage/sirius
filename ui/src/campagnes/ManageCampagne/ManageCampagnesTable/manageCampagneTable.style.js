import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const FormationContainer = styled.div`
  & div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    & p:first-of-type {
      margin-right: 0.2rem;
    }
  }
`;

export const TemoignagesCount = styled.p`
  text-align: center;
  color: var(--text-disabled-grey);
`;

export const ToolTipContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  gap: 0.5rem;
`;
