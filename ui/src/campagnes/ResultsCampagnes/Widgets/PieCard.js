import ReactEChartsCore from "echarts-for-react/lib/core";
import parse from "html-react-parser";
import { HalfWidthContainer } from "../../styles/resultsCampagnes.style";

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

const pieColorGetter = (length) => {
  const colors = ["#E2E8F0", "#FCBFB7", "#C3FAD5", "#006A6F", "#6A6AEC"];
  if (length === 3) return ["#FCBFB7", "#C3FAD5", "#6A6AEC"];
  if (length === 2) return ["#FCBFB7", "#6A6AEC"];
  return colors;
};

const pieOption = (countedResponses) => ({
  textStyle: {
    fontFamily: "Marianne",
  },
  tooltip: {
    trigger: "item",
    formatter: "{b} <br /> {c} ({d}%)",
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
      data: countedResponses.sort((a, b) => {
        return a.value - b.value;
      }),
      color: pieColorGetter(countedResponses.length),
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
        length2: 40,
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay: function () {
        return Math.random() * 200;
      },
    },
  ],
});

export const PieCard = ({ id, echarts, responses, title }) => {
  const option = pieResponsesFormatting(responses);
  if (!option.length) return null;
  return (
    <HalfWidthContainer className={`exportCharts-${id}`}>
      <p>{parse(title.replace(/<br \/>/gi, ""))}</p>
      <div>
        <ReactEChartsCore
          echarts={echarts}
          option={pieOption(option)}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </HalfWidthContainer>
  );
};

export default PieCard;
