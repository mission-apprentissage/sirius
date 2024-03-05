import styled from "@emotion/styled";

export const HeaderItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const FormationContainer = styled.div`
  & > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    & p:first-of-type {
      margin-right: 0.2rem;
    }
  }
`;

export const EtablissementLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;

  & p {
    font-size: 14px;
    line-height: 16px;
  }
`;

export const TemoignagesCount = styled.p`
  text-align: center;
  color: var(--text-disabled-grey);
`;

export const ToolTipContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 350px;

  & span {
    margin: 0;
  }
`;
