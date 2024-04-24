import React from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import parse from "html-react-parser";
import { FullWidthContainer } from "../../styles/resultsCampagnes.style";

const colors = ["#F95C5E", "#FCBFB7", "#6A6AEC"];

const multiEmojiOption = (responses, emojiMapping) => {
  const labelFormatter = (param) => {
    if (param.data == 0) return "";
    return param.data;
  };

  const series = responses.data.map((response, index) => {
    return {
      name: `${emojiMapping[index].emoji} ${emojiMapping[index].value}`,
      type: "bar",
      stack: "total",
      label: {
        show: true,
        formatter: labelFormatter,
      },
      emphasis: {
        focus: "series",
      },
      data: response[index],
      color: colors[index],
    };
  });

  const removeHTMLTagRegex = /(<([^>]+)>)/gi;

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
        fontFamily: "Marianne",
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
      data: responses.questions.map((question) => question.replace(removeHTMLTagRegex, "")),
    },
    series: series,
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
