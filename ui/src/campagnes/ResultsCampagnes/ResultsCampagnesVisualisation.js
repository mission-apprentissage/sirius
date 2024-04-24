import React, { useState } from "react";
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

const ResultsCampagnesVisualisation = ({ temoignages }) => {
  const [expandedAccordion, setExpandedAccordion] = useState("");

  return (
    <div className={fr.cx("fr-accordions-group")} style={{ width: "100%" }}>
      {temoignages.categories.map((category, index) => {
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
              {category.questionsList.map((question) => {
                return (
                  <React.Fragment key={question.id}>
                    {question.widget.type === "text" && (
                      <VerbatimCard
                        id={category.id}
                        responses={question.responses}
                        title={question.label}
                      />
                    )}
                    {(question.widget.type === "pie" || question.widget.type === "emoji") && (
                      <PieCard
                        id={category.id}
                        echarts={echarts}
                        responses={question.responses}
                        title={question.label}
                      />
                    )}
                    {question.widget.type === "bar" && (
                      <BarCard
                        id={category.id}
                        echarts={echarts}
                        responses={question.responses}
                        title={question.label}
                      />
                    )}
                    {question.widget.type === "multiEmoji" && (
                      <MultiEmojiCard
                        id={category.id}
                        echarts={echarts}
                        responses={question.responses}
                        emojiMapping={question.widget.mapping}
                        title={question.label}
                      />
                    )}
                  </React.Fragment>
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
