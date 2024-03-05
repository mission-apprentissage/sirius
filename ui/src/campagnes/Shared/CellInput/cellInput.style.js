import styled from "@emotion/styled";
import { Input } from "@codegouvfr/react-dsfr/Input";

export const NotEditingContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;

  & p {
    margin-right: 0.5rem;
  }

  & span {
    margin-right: 0;
  }
`;

export const StyledInput = styled((props) => <Input {...props} />)`
  ${(props) => {
    if (props.minWidth) {
      return `
      min-width: ${props.minWidth} !important;
      `;
    }
    if (props.maxWidth) {
      return `
      max-width: ${props.maxWidth} !important;
      `;
    }
  }}
  & .fr-error-text,
  & .fr-valid-text {
    display: none !important;
  }
`;
