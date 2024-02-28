import styled from "@emotion/styled";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";

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
