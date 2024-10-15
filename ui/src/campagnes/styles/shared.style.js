import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";

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

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;

  & .fr-table > table {
    width: 100%;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${fr.spacing("2w")};

  & fieldset {
    margin-bottom: 0;
  }

  & .fr-checkbox-group {
    width: 350px;
  }
`;

export const SelectAllFormationContainer = styled.div`
  margin-top: 1rem;

  & > fieldset {
    margin-bottom: 0;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${fr.spacing("2w")};
`;

export const IntituleFormation = styled.h6`
  color: var(--text-action-high-blue-france);
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  margin: 10px 0;
`;

export const StyledBadge = styled(Badge)`
  background-color: var(--background-contrast-purple-glycine) !important;
  color: var(--background-flat-purple-glycine) !important;
`;

export const Duration = styled.p`
  font-size: 12px;
  color: var(--text-disabled-grey);
  margin-bottom: 0;
`;
