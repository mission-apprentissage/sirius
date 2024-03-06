import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const ToolTipContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 350px;

  & span {
    margin: 0;
  }
`;

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const FormationContainer = styled.div`
  & > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    & p:first-of-type {
      margin-right: 0.2rem;
    }
  }
`;

export const SearchNoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: ${fr.spacing("6w")};

  p {
    text-decoration: underline;
    color: var(--text-action-high-blue-france);
    cursor: pointer;
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;
