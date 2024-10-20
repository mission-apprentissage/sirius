import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import styled from "@emotion/styled";

export const AccordionLabelByDiplomeTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--text-title-grey);

  & > p {
    margin-top: 0.5rem;
    font-weight: 400;
  }
`;

export const AccordionLabelByEtablissementContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--text-title-grey);

  & > div:first-of-type {
    display: flex;
    flex-direction: row;
  }

  & > p:first-of-type,
  & > p:nth-of-type(2) {
    font-size: 12px;
    font-weight: 700;
    margin-top: 0;
  }

  & > p {
    margin-top: 0.8rem;
    font-weight: 400;
  }
`;

export const StyledAccordion = styled(Accordion)`
  min-width: 100%;
  & label:first-of-type {
    margin-top: 1.5rem;
  }

  & .fr-collapse--expanded {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
`;

export const FormationCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const FormationCardByEtablissement = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #dddddd;
  padding: 1rem 1rem 0 1rem;
  margin: 0.5rem 0.5rem;
  width: calc(25% - 1rem);
  border-bottom: ${(props) =>
    props.isChecked && !props.isAlreadyCreated
      ? "4px solid var(--border-active-blue-france)"
      : "4px solid var(--border-default-grey)"};

  ${(props) => {
    if (!props.isAlreadyCreated) {
      return `
      &:hover {
        background-color: var(--background-default-grey-hover);
      }
      `;
    }
  }}

  ${fr.breakpoints.down("lg")} {
    width: calc(33% - 1rem);
  }

  ${fr.breakpoints.down("md")} {
    width: calc(50% - 1rem);
  }

  ${fr.breakpoints.down("xs")} {
    width: 100%;
  }

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > h6 {
    margin: 1rem 0;
    color: var(--text-action-high-blue-france);
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;

    ${(props) => {
      if (props.isAlreadyCreated) {
        return `
        color: var(--border-default-grey) !important;
        `;
      }
    }}
  }

  & > p {
    font-size: 14px;

    ${(props) => {
      if (props.isAlreadyCreated) {
        return `
        color: var(--border-default-grey);
        `;
      }
    }}
  }

  & > p:last-of-type {
    color: var(--text-action-high-blue-france);
    font-size: 12px;

    ${(props) => {
      if (props.isAlreadyCreated) {
        return `
        color: var(--text-disabled-grey)!important;
        `;
      }
    }}
  }
`;

export const FormationCardByDiplomeType = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #dddddd;
  padding: 1rem 1rem 0 1rem;
  margin: 0.5rem 0.5rem;
  width: calc(25% - 1rem);
  border-bottom: ${(props) =>
    props.isChecked && !props.isAlreadyCreated
      ? "4px solid var(--border-active-blue-france)"
      : "4px solid var(--border-default-grey)"};

  ${(props) => {
    if (!props.isAlreadyCreated) {
      return `
    &:hover {
      background-color: var(--background-default-grey-hover);
    }
    `;
    }
  }}

  ${fr.breakpoints.down("lg")} {
    width: calc(33% - 1rem);
  }

  ${fr.breakpoints.down("md")} {
    width: calc(50% - 1rem);
  }

  ${fr.breakpoints.down("xs")} {
    width: 100%;
  }

  & > div:first-of-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  & > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    margin: 1.5rem 0;

    & > p {
      margin: 0;
      ${(props) => {
        if (props.isAlreadyCreated) {
          return `
        color: var(--border-default-grey) !important;
        `;
        }
      }}
    }

    & > p:first-of-type {
      font-size: 14px;
    }
    & > p:nth-of-type(2),
    & > p:nth-of-type(3) {
      font-size: 12px;
    }
  }

  & > h6 {
    margin: 1rem 0;
    color: var(--text-action-high-blue-france);
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;

    ${(props) => {
      if (props.isAlreadyCreated) {
        return `
      color: var(--border-default-grey) !important;
      `;
      }
    }}
  }

  & > p {
    font-size: 14px;

    ${(props) => {
      if (props.isAlreadyCreated) {
        return `
      color: var(--border-default-grey);
      `;
      }
    }}
  }

  & > p:last-of-type {
    color: var(--text-action-high-blue-france);
    font-size: 12px;

    ${(props) => {
      if (props.isAlreadyCreated) {
        return `
      color: var(--text-disabled-grey)!important;
      `;
      }
    }}
  }
`;

export const StyledBadge = styled((props) => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { isAlreadyCreated, ...rest } = props;
  return <Badge {...rest} />;
})`
  background-color: var(--background-contrast-purple-glycine) !important;
  color: var(--background-flat-purple-glycine) !important;

  ${(props) => {
    if (props.isAlreadyCreated) {
      return `
        background-color: var(--border-default-grey) !important;
        color: var(--text-disabled-grey) !important;
      `;
    }
  }}
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: ${fr.spacing("2w")};
`;

export const Duration = styled.p`
  font-size: 12px;
  color: var(--text-disabled-grey);
`;

export const HeaderCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & input {
    margin: 0 !important;
  }

  & label {
    margin: 0 !important;
  }

  & span {
    color: var(--text-disabled-grey);
  }
`;
