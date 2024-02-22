import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const Container = styled.main`
  max-width: 62em;
  margin: ${fr.spacing("8w")} auto;

  ${fr.breakpoints.down("md")} {
    margin: ${fr.spacing("6w")} ${fr.spacing("2w")};
  }

  & > p {
    color: var(--text-active-blue-france);
  }
`;
