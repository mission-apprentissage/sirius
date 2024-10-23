import { fr } from "@codegouvfr/react-dsfr";
import { Card } from "@codegouvfr/react-dsfr/Card";
import styled from "@emotion/styled";

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
  margin-bottom: ${fr.spacing("6w")};

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
  padding: 0 ${fr.spacing("12w")} ${fr.spacing("6w")} ${fr.spacing("12w")};
  background-color: var(--background-alt-blue-france);

  ${fr.breakpoints.only("xs")} {
    padding: 0 ${fr.spacing("4w")};
  }

  & h2 {
    text-align: center;
    margin: ${fr.spacing("8w")} 0;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

// eslint-disable-next-line no-unused-vars
export const StyledCard = styled(({ notClickable, isClicked, ...props }) => <Card {...props} />)`
  display: flex;
  align-items: center;
  border-bottom: 3px solid black;
  margin: ${fr.spacing("2w")};
  text-align: center;
  cursor: pointer;

  &:hover {
    border-bottom: 3px solid var(--border-default-grey);
  }

  ${({ notClickable }) => notClickable && `cursor: default !important;`}

  ${({ isClicked }) => isClicked && `border-bottom: 3px solid var(--border-active-blue-france)!important;`}

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

export const TestimonyContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${fr.spacing("4w")} ${fr.spacing("12w")};
  text-align: center;
  background-color: var(--background-alt-blue-france);

  ${fr.breakpoints.only("xs")} {
    padding: ${fr.spacing("4w")};
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

export const HowToContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${fr.spacing("6w")};
  width: 100%;

  & video {
    cursor: pointer !important;
  }
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: ${fr.spacing("2w")} 0;

  ${fr.breakpoints.down("md")} {
    flex-direction: column;
    text-align: center;
  }

  & span {
    margin-right: ${fr.spacing("1w")};
    font-size: 22px;

    ${fr.breakpoints.down("md")} {
      margin-right: 0;
      margin-bottom: ${fr.spacing("1w")};
    }
  }

  & p {
    margin: 0;
  }

  & button {
    cursor: default;
  }
`;

export const SharePicturesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${fr.spacing("4w")} auto;
  padding: ${fr.spacing("4w")} ${fr.spacing("6w")};
  text-align: center;
  background-color: #f7fafc;
  gap: ${fr.spacing("4w")};

  ${fr.breakpoints.down("md")} {
    flex-direction: column;
  }

  & div {
    width: 33%;

    ${fr.breakpoints.down("md")} {
      width: 100%;
    }
  }
`;

export const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: ${fr.spacing("6w")} auto;

  width: 100%;

  ${fr.breakpoints.down("md")} {
    margin: ${fr.spacing("3w")};

    & > div {
      width: 90% !important;
    }
  }
`;

export const MultipleVideoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: ${fr.spacing("4w")};
  margin: ${fr.spacing("4w")} auto;
`;
