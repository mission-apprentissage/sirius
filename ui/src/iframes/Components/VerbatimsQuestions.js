/* eslint-disable no-undef */
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useEffect, useState } from "react";

import BlueArrowRight from "../../assets/icons/blue-arrow-right.svg";
import Quote from "../../assets/icons/quote.svg";
import ThumbsUpFill from "../../assets/icons/thumbs-up-fill.svg";
import ThumbsUpLine from "../../assets/icons/thumbs-up-line.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import useMatomoEvent from "../../hooks/useMatomoEvent";
import usePatchVerbatimFeedback from "../../hooks/usePatchVerbatimFeedback";
import { MATOMO_ACTION, MATOMO_CATEGORY } from "../../matomo";
import { etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import {
  AccordionTitle,
  ApprentiInfo,
  FeedbackContainer,
  TitleContainer,
  VerbatimContainer,
  VerbatimContent,
} from "./shared.style";

const VerbatimsQuestions = ({ verbatimsByQuestions, setVerbatimsStep }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [usefullFeedback, setUsefullFeedback] = useState(() => {
    const savedFeedback = localStorage.getItem("usefullFeedback");
    return savedFeedback ? JSON.parse(savedFeedback) : [];
  });
  const trackEvent = useMatomoEvent();

  const { isMobile, isDesktop } = useBreakpoints();

  const { mutate: patchVerbatimFeedback, patchedVerbatimFeedback } = usePatchVerbatimFeedback();

  useEffect(() => {
    localStorage.setItem("usefullFeedback", JSON.stringify(usefullFeedback));
  }, [usefullFeedback]);

  if (!Object.values(verbatimsByQuestions).flat().length) return null;

  const verbatimsGroupedByQuestionLabel = Object.values(verbatimsByQuestions)
    .flat()
    .reduce((acc, item) => {
      const { questionLabel, ...rest } = item;

      let group = acc.find((group) => group.questionLabel === questionLabel);
      if (!group) {
        group = { questionLabel, verbatims: [] };
        acc.push(group);
      }

      group.verbatims.push(rest);

      return acc;
    }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleUsefullFeedback = (id) => {
    if (usefullFeedback.includes(id)) {
      patchVerbatimFeedback({ verbatimId: id, isUseful: false });
      setUsefullFeedback(usefullFeedback.filter((item) => item !== id));
    } else {
      patchVerbatimFeedback({ verbatimId: id, isUseful: true });
      setUsefullFeedback([...usefullFeedback, id]);
    }
  };

  return (
    <>
      <TitleContainer>
        <h6>Plus de témoignages</h6>
        <Button
          aria-label="Revenir en arrière"
          iconId="fr-icon-arrow-go-back-fill"
          iconPosition="right"
          priority="tertiary no outline"
          onClick={() => {
            setVerbatimsStep(1);
            trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_GO_BACK_QUESTIONS);
          }}
        >
          {!isMobile && "Revenir en arrière"}
        </Button>
      </TitleContainer>
      <div className={fr.cx("fr-accordions-group")}>
        {verbatimsGroupedByQuestionLabel.map((verbatimsByQuestion, index) =>
          verbatimsByQuestion.verbatims.length ? (
            <Accordion
              expanded={!!(expandedAccordion === verbatimsByQuestion.questionLabel)}
              defaultExpanded={!!(expandedAccordion === verbatimsByQuestion.questionLabel)}
              onExpandedChange={(expanded) => {
                setExpandedAccordion(expanded ? verbatimsByQuestion.questionLabel : null);
                trackEvent(
                  MATOMO_CATEGORY.IFRAME_FORMATION,
                  MATOMO_ACTION.CLICK_QUESTION,
                  verbatimsByQuestion.questionLabel
                );
              }}
              key={verbatimsByQuestion.questionLabel}
              label={
                <AccordionTitle>
                  <img src={BlueArrowRight} aria-hidden={true} />
                  {verbatimsByQuestion.questionLabel}
                </AccordionTitle>
              }
            >
              {verbatimsByQuestion.verbatims.map((verbatim, index) => (
                <VerbatimContainer key={index} isDesktop={isDesktop}>
                  <img src={Quote} aria-hidden={true} />
                  <VerbatimContent>
                    {expandedIndex === index
                      ? `« ${verbatim.content} »`
                      : `« ${verbatim.content.substring(0, 230)}${verbatim.content.length > 230 ? "..." : ""} »`}
                    {verbatim.content.length > 230 && (
                      <>
                        <br />
                        <span
                          onClick={() => {
                            toggleExpand(index);
                            trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_VERBATIM_SEE_MORE);
                          }}
                        >
                          {expandedIndex === index ? " Voir moins" : " Voir plus"}
                        </span>
                      </>
                    )}
                  </VerbatimContent>{" "}
                  <ApprentiInfo>
                    Apprenti·e du {etablissementLabelGetterFromFormation(verbatim)} -{" "}
                    {new Date(verbatim.createdAt).toLocaleDateString("fr", { month: "long", year: "numeric" })}
                  </ApprentiInfo>
                  <FeedbackContainer
                    onClick={() => {
                      handleUsefullFeedback(verbatim.id);
                      trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_USEFUL_VERBATIM);
                    }}
                  >
                    Cet avis est utile ?{" "}
                    <img
                      src={usefullFeedback.includes(verbatim.id) ? ThumbsUpFill : ThumbsUpLine}
                      alt="feedback avis utile"
                    />
                  </FeedbackContainer>
                </VerbatimContainer>
              ))}
            </Accordion>
          ) : null
        )}
      </div>
    </>
  );
};

export default VerbatimsQuestions;
