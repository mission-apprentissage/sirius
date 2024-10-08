import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const EtablissementLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;

  & > p {
    font-size: 14px;
    line-height: 16px;
  }
`;

export const TemoignagesCount = styled.p`
  text-align: center;
  color: var(--text-disabled-grey);
`;

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 ${fr.spacing("2w")};

  & > .fr-table {
    margin-bottom: 0;
  }
  & > .fr-table > table {
    padding-bottom: ${fr.spacing("3w")};
  }
`;

export const DiplomeLabel = styled.p`
  font-size: 14px;
  color: var(--text-disabled-grey);
  margin-top: 10px;
`;
