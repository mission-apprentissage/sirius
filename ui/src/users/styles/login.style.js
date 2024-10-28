import { fr } from "@codegouvfr/react-dsfr";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import styled from "@emotion/styled";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: ${fr.spacing("2w")} 0;

  & > div:first-of-type {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    ${fr.breakpoints.down("md")} {
      flex-direction: column;
    }

    & > div {
      width: calc(50% - ${fr.spacing("2w")});

      ${fr.breakpoints.down("md")} {
        width: 100%;
      }
    }
  }

  & div:nth-of-type(2) {
    width: 100%;
  }

  & > p {
    margin-left: calc(50% + ${fr.spacing("2w")} * 2);
    width: 50%;
    color: var(--text-active-blue-france);
    text-decoration: underline;
    cursor: pointer;

    ${fr.breakpoints.down("md")} {
      margin-left: 0;
      width: 100%;
    }
  }

  & button {
    margin-top: ${fr.spacing("4w")};

    ${fr.breakpoints.down("md")} {
      margin-top: ${fr.spacing("2w")};
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
`;

export const StyledPasswordInput = styled(PasswordInput)`
  & div {
    width: 100%;
  }
`;
