import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const LoginAndSignupContainer = styled.main`
  max-width: 48em;
  margin: ${fr.spacing("8w")} auto;

  ${fr.breakpoints.down("md")} {
    max-width: 100%;
    margin: ${fr.spacing("6w")} ${fr.spacing("2w")};
  }

  & > p {
    color: var(--text-active-blue-france);
    width: 100%;
    text-align: center;
    margin: ${fr.spacing("4w")} 0;
  }

  ${fr.breakpoints.down("md")} {
    & p:last-of-type {
      text-align: left;
    }
  }
`;

export const LoginAndSignupHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-bottom: ${fr.spacing("3w")};

  ${fr.breakpoints.down("md")} {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  & h5 {
    margin: ${fr.spacing("2w")} 0;

    ${fr.breakpoints.down("md")} {
      margin: ${fr.spacing("1w")} 0;
    }
  }

  & h2 {
    margin: 0;
    padding-bottom: 0;
    color: var(--text-active-blue-france);
  }
`;
