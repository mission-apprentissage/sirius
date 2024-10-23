import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
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
    align-items: center;
    gap: 0.1rem;
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
  & .fr-collapse--expanded {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
`;
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 1rem 0 0 0;
  padding: 0 ${fr.spacing("2w")};
`;
