import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";

export const Container = styled.section`
  margin: ${fr.spacing("8w")} auto 0 auto;

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
    padding: 0 ${fr.spacing("12w")};

    ${fr.breakpoints.only("xs")} {
      padding: 0 ${fr.spacing("4w")};
    }
  }
`;

export const GoalContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${fr.spacing("12w")};
  margin-bottom: ${fr.spacing("12w")};

  ${fr.breakpoints.only("xs")} {
    padding: 0 ${fr.spacing("4w")};
  }

  & img {
    max-width: 200px;
  }

  & section {
    display: flex;
    flex-direction: row;
    margin: ${fr.spacing("2w")} auto;
    width: 80%;

    ${fr.breakpoints.down("md")} {
      width: 100%;
    }

    & div {
      width: 50%;

      &:first-of-type {
        text-align: right;
        margin-right: ${fr.spacing("8w")};
        color: #000091;

        ${fr.breakpoints.down("md")} {
          margin-right: ${fr.spacing("4w")};
        }

        h3 {
          color: #000091;
        }
      }

      &:nth-of-type(2) {
        text-align: left;
        margin-left: ${fr.spacing("8w")};
        color: #f95c5e;

        ${fr.breakpoints.down("md")} {
          margin-left: ${fr.spacing("4w")};
        }

        h3 {
          color: #f95c5e;
        }
      }
    }
  }
`;

export const CFAContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${fr.spacing("12w")};
  background-color: var(--background-alt-blue-france);

  ${fr.breakpoints.only("xs")} {
    padding: 0 ${fr.spacing("4w")};
  }

  & p {
    margin-top: ${fr.spacing("8w")};
  }

  & h2 {
    text-align: center;
    margin-bottom: ${fr.spacing("8w")};
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  width: 100%;
`;

export const StyledCard = styled(Card)`
  display: flex;
  align-items: center;
  border-bottom: 3px solid black;
  margin: ${fr.spacing("2w")};
  text-align: center;

  ${fr.breakpoints.up("sm")} {
    width: 100%;
  }

  ${fr.breakpoints.up("md")} {
    width: calc(50% - ${fr.spacing("2w")} * 2);
  }

  ${fr.breakpoints.up("lg")} {
    width: calc(25% - ${fr.spacing("2w")} * 2);
  }

  & img {
    margin-top: ${fr.spacing("4w")};
  }

  & span {
    background-color: var(--artwork-decorative-purple-glycine);
    color: var(--text-action-high-purple-glycine);
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: ${fr.spacing("2w")};
  }

  & .fr-card__footer {
    display: none;

    ${fr.breakpoints.down("md")} {
      display: inline-block;
    }
  }
`;

export const CFAButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: ${fr.spacing("8w")} auto;

  & button {
    margin: 0 ${fr.spacing("2w")};
  }

  & button:first-of-type {
    display: flex;

    ${fr.breakpoints.down("md")} {
      display: none;
    }
  }
`;

export const ExperimentationAndTestimonyContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${fr.spacing("12w")};
  margin-top: ${fr.spacing("8w")};
  text-align: center;

  ${fr.breakpoints.only("xs")} {
    padding: 0 ${fr.spacing("4w")};
  }

  & h2 {
    margin-bottom: ${fr.spacing("1w")};

    & span {
      margin-right: ${fr.spacing("1w")};
    }
  }

  & > p {
    font-size: 14px;
  }
`;

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: ${fr.spacing("4w")} auto;
  flex-wrap: wrap;
  width: 100%;

  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;

    ${fr.breakpoints.up("md")} {
      width: 25%;
    }
  }
`;

export const QuotesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: ${fr.spacing("4w")} auto;
  width: calc(100% - ${fr.spacing("4w")} * 2);
  align-items: center;
  text-align: left;

  & img {
    margin-right: ${fr.spacing("4w")};

    ${fr.breakpoints.down("md")} {
      display: none;
    }
  }

  & div {
    padding-left: ${fr.spacing("4w")};
    border-left: 1px solid lightgrey;

    ${fr.breakpoints.down("md")} {
      border-left: none;
    }
  }

  & p:first-of-type {
    margin-top: 0;
  }

  & p:last-of-type {
    margin-bottom: 0;
  }
`;

export const ExpressedTestimonies = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: ${fr.spacing("4w")} auto;
  width: calc(100% - ${fr.spacing("4w")} * 2);
  align-items: center;
  text-align: left;

  & img {
    margin-right: ${fr.spacing("4w")};

    ${fr.breakpoints.up("md")} {
      display: none;
    }
  }
`;

export const NeedHelpContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${fr.spacing("4w")} ${fr.spacing("12w")};
  text-align: center;
  background-color: var(--background-alt-blue-france);
  width: 100%;

  ${fr.breakpoints.down("md")} {
    padding: ${fr.spacing("4w")} ${fr.spacing("4w")};
    text-align: left;
  }

  & h5 {
    margin: ${fr.spacing("4w")} 0;
  }

  & div {
    display: flex;
    flex-direction: row;
    color: var(--text-active-blue-france);

    ${fr.breakpoints.down("md")} {
      flex-direction: column;
      align-items: center;
    }
  }

  & div > div {
    margin: 0 ${fr.spacing("1w")};

    ${fr.breakpoints.down("md")} {
      flex-direction: row;
      align-items: center;
    }
  }

  p {
    margin: 0 ${fr.spacing("1w")};

    ${fr.breakpoints.down("md")} {
      margin: ${fr.spacing("1w")};
    }
  }
`;

export const ScrollToTop = styled.div`
  display: none;

  ${fr.breakpoints.down("md")} {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-decoration: underline;
    margin: ${fr.spacing("6w")} auto;
    color: var(--text-active-blue-france);
    cursor: pointer;

    & p {
      margin: 0 ${fr.spacing("1w")};
    }
  }
`;
