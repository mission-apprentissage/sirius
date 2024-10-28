import styled from "@emotion/styled";

export const MultSelectContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1.5rem;
`;

export const InputContainer = styled.div`
  width: 100%;

  & input {
    cursor: pointer;
  }
`;

export const MenuContainer = styled.div`
  z-index: 99999;
  position: absolute;
  width: 100%;
  margin-top: 7px;
  padding: 20px 8px 0 8px;
  background-color: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  box-shadow: 0px 4px 12px 0px #00001229;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;

  & .fr-checkbox-group {
    padding-left: 12px;
  }

  & .fr-checkbox-group:hover {
    background-color: #f0f0f0;
    width: 100%;
  }

  & p {
    margin: 0;
    padding-bottom: 20px;
    text-align: center;
  }
`;
