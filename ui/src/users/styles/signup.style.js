import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${fr.spacing("2w")};
`;

export const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${fr.spacing("3w")};

  ${fr.breakpoints.down("md")} {
    flex-direction: column;
    gap: 0;
  }
`;

export const PasswordsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${fr.spacing("3w")};
  align-items: flex-start;

  ${fr.breakpoints.down("md")} {
    flex-direction: column;
    gap: 0;
  }
`;

export const StyledPasswordInput = styled(PasswordInput)`
  width: 50%;

  ${fr.breakpoints.down("md")} {
    width: 100%;
  }

  & #password-messages-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0 ${fr.spacing("1w")};
  }
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const SuccessfulSignupHeader = styled.header`
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
    padding-bottom: ${fr.spacing("1w")};
    color: #1f8e4a;
  }
`;
