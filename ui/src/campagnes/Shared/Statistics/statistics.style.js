import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

export const StatisticsContainer = styled.header`
  margin: 0 auto;
  padding: ${fr.spacing("6w")} 0;
  background-color: var(--background-alt-blue-france);
`;

export const Content = styled.div`
  max-width: 78em;
  margin: auto;
  padding: 0 ${fr.spacing("2w")};
  display: flex;
  justify-content: center;
  flex-direction: column;

  & h1 {
    margin: 0;
  }

  & span {
    margin-right: 0.5rem;
  }

  & div {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
`;

export const StatisticsCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 16%;

  ${fr.breakpoints.down("md")} {
    width: 50%;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
  }
`;
