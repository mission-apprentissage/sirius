import React, { useState, useEffect } from "react";

import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import * as echarts from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { matchIdAndQuestions, matchCardTypeAndQuestions } from "../../utils/temoignage";
import { getCategoriesWithEmojis } from "../utils";
import PieCard from "./Widgets/PieCard";
import VerbatimCard from "./Widgets/VerbatimCard";
import MultiEmojiCard from "./Widgets/MultiEmojiCard";
import { DataVizContainer } from "../styles/resultsCampagnes.style";
import BarCard from "./Widgets/BarCard";

echarts.use([
  TooltipComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
  BarChart,
  VisualMapComponent,
]);

const ResultsCampagnesVisualisation = ({
  temoignages,
  questionnaire,
  questionnaireUI,
  expandedAccordion,
  setExpandedAccordion,
}) => {
  const [matchedIdAndQuestions, setMatchedIdAndQuestions] = useState({});
  const [matchedCardTypeAndQuestions, setMatchedCardTypeAndQuestions] = useState({});

  useEffect(() => {
    if (questionnaire && questionnaireUI) {
      setMatchedIdAndQuestions(matchIdAndQuestions(questionnaire));
      setMatchedCardTypeAndQuestions(matchCardTypeAndQuestions(questionnaire, questionnaireUI));
    }
  }, [questionnaire, questionnaireUI]);

  const categories = getCategoriesWithEmojis(questionnaire);

  return (
    <div className={fr.cx("fr-accordions-group")}>
      {categories.map((category, index) => {
        const questionsList = Object.keys(questionnaire.properties[category.id].properties);

        const filteredQuestionsList = questionsList.filter((question) =>
          Object.keys(questionnaire.properties[category.id].properties).includes(question)
        );
        return (
          <Accordion
            key={index}
            onExpandedChange={() => setExpandedAccordion(category.id)}
            expanded={expandedAccordion === category.id ? true : false}
            label={
              <h6>
                {category.emoji} {category.title}
              </h6>
            }
          >
            <DataVizContainer>
              {filteredQuestionsList.map((question) => {
                const responses = temoignages.length
                  ? temoignages
                      .map((temoignage) => temoignage.reponses[question])
                      .flat()
                      .filter(Boolean)
                  : [];

                return (
                  matchedIdAndQuestions[question] && (
                    <React.Fragment key={question}>
                      {matchedCardTypeAndQuestions[question] === "text" && (
                        <VerbatimCard
                          id={category.id}
                          responses={responses}
                          title={matchedIdAndQuestions[question]}
                        />
                      )}
                      {(matchedCardTypeAndQuestions[question] === "pie" ||
                        matchedCardTypeAndQuestions[question]?.type === "emoji") && (
                        <PieCard
                          id={category.id}
                          echarts={echarts}
                          responses={responses}
                          title={matchedIdAndQuestions[question]}
                        />
                      )}
                      {matchedCardTypeAndQuestions[question] === "bar" && (
                        <BarCard
                          id={category.id}
                          echarts={echarts}
                          responses={responses}
                          title={matchedIdAndQuestions[question]}
                        />
                      )}
                      {matchedCardTypeAndQuestions[question]?.type === "multiEmoji" && (
                        <MultiEmojiCard
                          id={category.id}
                          echarts={echarts}
                          responses={responses}
                          title={matchedIdAndQuestions[question]}
                        />
                      )}
                    </React.Fragment>
                  )
                );
              })}
            </DataVizContainer>
          </Accordion>
        );
      })}
    </div>
  );
};

export default ResultsCampagnesVisualisation;
