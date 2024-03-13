import React from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import parse from "html-react-parser";
import { FullWidthContainer } from "../../styles/resultsCampagnes.style";

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

const multiEmojiOption = (responses, emojiMapping) => {
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
        fontSize: "18px",
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
        name: `😫 ${emojiMapping[0].value}`,
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
        color: "#FCBFB7",
      },
      {
        name: `🤔 ${emojiMapping[1].value}`,
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
        color: "#C3FAD5",
      },
      {
        name: `😝 ${emojiMapping[2].value}`,
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
        color: "#6A6AEC",
      },
    ],
  };
};

const MultiEmojiCard = ({ id, echarts, responses, title, emojiMapping }) => {
  const option = multiEmojiOption(responses, emojiMapping);

  if (!option.series.length) return null;
  return (
    <FullWidthContainer className={`exportCharts-${id} fullSize`}>
      <p>{parse(title.replace(/<br \/>/gi, ""))}</p>
      <div>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </FullWidthContainer>
  );
};

export default MultiEmojiCard;
