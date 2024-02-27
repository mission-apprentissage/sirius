import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const ActionButtonsContainer = styled.section`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  margin: 1rem 0;

  ${fr.breakpoints.down("md")} {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  & fieldset {
    margin: 0;
  }

  & label:first-of-type {
    font-weight: 700;
  }

  & button {
    margin: 0 0.5rem 0.5rem 0.5rem;

    ${fr.breakpoints.down("md")} {
      margin: 0.5rem 0;
      width: 100%;
    }
  }

  & > div {
    ${fr.breakpoints.down("md")} {
      width: 100%;
    }
  }
`;

export const ToolTipContainer = styled.div`
  width: 350px;
`;
