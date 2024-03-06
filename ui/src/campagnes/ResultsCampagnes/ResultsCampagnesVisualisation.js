import React, { useState, useEffect } from "react";
import { Masonry } from "masonic";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import parse from "html-react-parser";
import { matchIdAndQuestions, matchCardTypeAndQuestions } from "../../utils/temoignage";
import { getCategoriesWithEmojis } from "../utils";
import { VerbatimsContainer, MasonryItemContainer } from "../styles/resultsCampagnes.style";
import { VERBATIM_STATUS_LABELS } from "../../constants";
import Quote from "../../assets/icons/quote.svg";

echarts.use([
  TooltipComponent,
  GridComponent,
  PieChart,
  CanvasRenderer,
  LegendComponent,
  BarChart,
  VisualMapComponent,
]);

const pieResponsesFormatting = (responses) =>
  responses.reduce((acc, name) => {
    if (name) {
      const index = acc.findIndex((item) => item.name === name);
      if (index !== -1) {
        acc[index].value++;
      } else {
        acc.push({ name, value: 1 });
      }
    }
    return acc;
  }, []);

const barResponsesFormatting = (responses) => {
  const cleanedUpResponses = responses
    .map((response) => Object.keys(response).includes("label") && response)
    .filter((elem) => elem);

  return cleanedUpResponses.reduce((acc, response) => {
    const index = acc?.findIndex((item) => item.label === response.label);
    if (index === -1) {
      acc.push({ label: response.label, value: [response.value] });
    } else {
      acc[index].value = [...acc[index].value, response.value];
    }
    return acc;
  }, []);
};

const pieColorGetter = (length) => {
  const colors = ["#287254", "#6fe59d", "#9ef9be", "#c2fad5", "#e3fdeb"];
  if (length === 3) return ["#287254", "#9ef9be", "#e3fdeb"];
  if (length === 2) return ["#287254", "#e3fdeb"];
  return colors;
};

const pieOption = (countedResponses) => ({
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    position: (pos, params, dom, rect, size) => {
      const obj = { top: 60 };
      obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    },
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: "75%",
      center: ["50%", "50%"],
      data: countedResponses.sort((a, b) => {
        return a.value - b.value;
      }),
      color: pieColorGetter(countedResponses.length),
      roseType: "radius",
      label: {
        color: "#161616",
        overflow: "break",
        formatter: "{b} \n ({c} - {d}%)",
      },
      labelLine: {
        lineStyle: {
          color: "#161616",
        },
        smooth: 0.2,
        length: 10,
        length2: 30,
      },
      itemStyle: {
        shadowBlur: 30,
        shadowColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 1,
        borderColor: "white",
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: function () {
        return Math.random() * 200;
      },
    },
  ],
});

const barOption = (responses) => {
  const zero = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === 0).length;
  });

  const one = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === 1).length;
  });

  const two = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === 2).length;
  });

  const three = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === 3).length;
  });

  const labelFormatter = (param) => {
    if (param.data == 0) return "";
    return param.data;
  };

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      textStyle: {
        fontSize: "36px",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
      overflow: "allow",
    },
    xAxis: {
      type: "value",
      scale: false,
    },
    yAxis: {
      type: "category",
      data: barResponsesFormatting(responses).map((response) => response.label),
    },
    series: [
      {
        name: "😫",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: zero,
        color: "#287254",
      },
      {
        name: "🧐",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: one,
        color: "#9ef9be",
      },
      {
        name: "😊",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: two,
        color: "#c2fad5",
      },
      {
        name: "😝",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: three,
        color: "#e3fdeb",
      },
    ],
  };
};

const multiEmojiOption = (responses) => {
  const zero = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === "Pas vraiment" || value === "Pas ok").length;
  });

  const one = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === "Moyen").length;
  });

  const two = barResponsesFormatting(responses).map((response) => {
    return response.value.filter((value) => value === "Oui" || value === "Bien").length;
  });
  const labelFormatter = (param) => {
    if (param.data == 0) return "";
    return param.data;
  };

  const removeHTMLTagRegex = /(<([^>]+)>)/gi;

  const questions = [
    ...new Set(responses.map((response) => response.label?.replace(removeHTMLTagRegex, ""))),
  ];

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      textStyle: {
        fontSize: "36px",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
      overflow: "allow",
    },
    xAxis: {
      type: "value",
      scale: false,
    },
    yAxis: {
      type: "category",
      data: questions,
    },
    series: [
      {
        name: "😫",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: zero,
        color: "#287254",
      },
      {
        name: "🤔",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: one,
        color: "#9ef9be",
      },
      {
        name: "😝",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: labelFormatter,
        },
        emphasis: {
          focus: "series",
        },
        data: two,
        color: "#e3fdeb",
      },
    ],
  };
};

const ResultsCampagnesVisualisation = ({
  campagne,
  temoignages,
  questionnaire,
  questionnaireUI,
}) => {
  const [matchedIdAndQuestions, setMatchedIdAndQuestions] = useState({});
  const [matchedCardTypeAndQuestions, setMatchedCardTypeAndQuestions] = useState({});

  useEffect(() => {
    if (campagne) {
      setMatchedIdAndQuestions(matchIdAndQuestions(campagne, questionnaire));
      setMatchedCardTypeAndQuestions(
        matchCardTypeAndQuestions(campagne, questionnaire, questionnaireUI)
      );
    }
  }, [campagne]);

  const categories = getCategoriesWithEmojis(questionnaire);

  return (
    <div className={fr.cx("fr-accordions-group")}>
      {categories.map((category, index) => {
        const questionsList = Object.keys(questionnaire.properties[category.id].properties);

        const filteredQuestionsList = questionsList.filter((question) =>
          Object.keys(questionnaire.properties[category.id].properties).includes(question)
        );
        return (
          <Accordion key={index} label={`${category.emoji} ${category.title}`}>
            {filteredQuestionsList.map((question) => {
              const responses = temoignages
                .map((temoignage) => temoignage.reponses[question])
                .flat()
                .filter(Boolean);

              const MasonryItem = ({ data: { content } }) => (
                <MasonryItemContainer>
                  <img src={Quote} />« {content} »
                </MasonryItemContainer>
              );

              const VerbatimCard = () => {
                const tabsLabel = [...new Set(responses.map((response) => response?.status))];

                const tabs = tabsLabel.map((tab) => {
                  const content = responses.filter((response) => response.status === tab);

                  return {
                    label: (
                      <>
                        {VERBATIM_STATUS_LABELS[tab]} ({content.length})
                      </>
                    ),
                    content: (
                      <Masonry
                        items={content}
                        render={MasonryItem}
                        columnGutter={24}
                        columnCount={5}
                      />
                    ),
                  };
                });

                return (
                  <VerbatimsContainer>
                    <p>{parse(matchedIdAndQuestions[question].replace(/<br \/>/gi, ""))}</p>
                    <Tabs tabs={tabs} />
                  </VerbatimsContainer>
                );
              };

              const PieCard = () => {
                return (
                  <VerbatimsContainer>
                    <p>{parse(matchedIdAndQuestions[question].replace(/<br \/>/gi, ""))}</p>
                    <ReactEChartsCore
                      echarts={echarts}
                      option={pieOption(pieResponsesFormatting(responses))}
                    />
                  </VerbatimsContainer>
                );
              };

              return (
                matchedIdAndQuestions[question] && (
                  <div key={question}>
                    {matchedCardTypeAndQuestions[question] === "text" && <VerbatimCard />}
                    {matchedCardTypeAndQuestions[question] === "pie" && <PieCard />}
                    {matchedCardTypeAndQuestions[question] === "bar" && (
                      <ReactEChartsCore echarts={echarts} option={barOption(responses)} />
                    )}
                    {matchedCardTypeAndQuestions[question]?.type === "emoji" && (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={pieOption(
                          pieResponsesFormatting(
                            responses,
                            matchedCardTypeAndQuestions[question]?.mapping
                          )
                        )}
                      />
                    )}
                    {matchedCardTypeAndQuestions[question]?.type === "multiEmoji" && (
                      <ReactEChartsCore
                        echarts={echarts}
                        option={multiEmojiOption(
                          responses,
                          matchedCardTypeAndQuestions[question]?.mapping
                        )}
                      />
                    )}
                  </div>
                )
              );
            })}
          </Accordion>
        );
      })}
    </div>
  );
};

export default ResultsCampagnesVisualisation;
