import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const SortButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;

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
