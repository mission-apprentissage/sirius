import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const Container = styled.main`
  max-width: 62em;
  margin: ${fr.spacing("8w")} auto;

  ${fr.breakpoints.down("md")} {
    margin: ${fr.spacing("6w")} ${fr.spacing("2w")};
  }

  & > p {
    color: var(--text-active-blue-france);
  }

  & ul {
    margin: ${fr.spacing("4w")};
    color: var(--text-active-blue-france);
  }
`;
