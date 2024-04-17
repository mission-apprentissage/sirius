import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const SortButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: ${fr.spacing("2w")};

  ${fr.breakpoints.down("md")} {
    flex-direction: column;
    align-items: flex-start;
  }

  & label {
    color: var(--text-disabled-grey);
  }

  & > .fr-select-group {
    margin-bottom: 0 !important;

    ${fr.breakpoints.down("md")} {
      width: 100%;
    }
  }

  & > .fr-search-bar {
    ${fr.breakpoints.down("md")} {
      width: 100%;
    }
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-end;

  & > div {
    margin-bottom: 0 !important;
  }

  & > p {
    color: var(--text-disabled-grey);
    margin-bottom: 0;
  }
`;
