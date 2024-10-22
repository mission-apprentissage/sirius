import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";

export const Container = styled.main`
  margin: 0 auto;

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
    padding: 0 ${fr.spacing("12w")};

    ${fr.breakpoints.only("xs")} {
      padding: 0 ${fr.spacing("4w")};
    }
  }
`;

export const CreateCampagneContainer = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 78em;
  margin: auto;
  padding: ${fr.spacing("6w")} 1.5rem;

  & > p {
    margin: 0;
  }

  & h1 {
    margin: 0 0 ${fr.spacing("2w")} 0;
  }

  & span {
    margin-right: 0.5rem;
  }

  & .fr-collapse {
    padding: 0;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${fr.spacing("2w")};
  margin-top: 1rem;
`;

export const FormationCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

export const ExistingCampagnesContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;

  background-color: var(--background-action-low-blue-france);
  color: var(--text-action-high-blue-france);

  & > p {
    font-size: 12px;
    font-weight: 500;
    margin: 0;
  }
`;

export const HeaderCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => (props.isAlreadyCreated ? "0.5rem 1rem 0 1rem" : "2.5rem 1rem 0 1rem")};

  & input {
    margin: 0 !important;
  }

  & label {
    margin: 0 !important;
  }
`;

export const BodyCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 1rem 2.5rem 1rem;

  & > p:last-of-type {
    color: var(--text-action-high-blue-france);
    font-size: 12px;
    margin: 0;
  }
`;

export const EtablissementLabelContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 8px;

  & > p {
    display: inline;
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
  }
`;

export const MiscellaneousInformationContainer = styled.div`
  margin-bottom: 14px;

  & > p {
    font-size: 12px;
    color: var(--text-mention-grey);
    margin: 5px 0;
    line-height: 20px;
  }
`;

export const FormationCardByDiplomeType = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #dddddd;
  margin: 0.5rem 0.5rem;
  width: calc(25% - 1rem);

  border-bottom: ${(props) =>
    props.isChecked
      ? "4px solid var(--border-active-blue-france)"
      : "4px solid var(--border-default-grey)"};

  &:hover {
    background-color: var(--background-default-grey-hover);
  }

  ${fr.breakpoints.down("lg")} {
    width: calc(33% - 1rem);
  }

  ${fr.breakpoints.down("md")} {
    width: calc(50% - 1rem);
  }

  ${fr.breakpoints.down("sm")} {
    width: 100%;
  }
`;
