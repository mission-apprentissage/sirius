import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const EtablissementLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;

  & > p {
    font-size: 12px;
    line-height: 16px;
  }
`;

export const TemoignagesCount = styled.p`
  text-align: center;
  color: var(--text-disabled-grey);
`;

export const TableContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & > div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0;
  }

  & > .fr-table {
    margin-bottom: 0;
  }

  & > .fr-table > table td {
    padding: 0.5rem 1rem;
  }

  & > .fr-table > table {
    padding-bottom: ${fr.spacing("3w")};
  }
`;

export const DiplomeLabel = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: var(--text-disabled-grey);
  margin-top: 8px;
`;
