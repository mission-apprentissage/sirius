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
        color: "#F95C5E",
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
        color: "#FCBFB7",
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
        color: "#C3FAD5",
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
        color: "#6A6AEC",
      },
    ],
  };
};

export const BarCard = ({ id, echarts, responses, title }) => {
  const option = barOption(responses);

  return (
    <FullWidthContainer className={`exportCharts-${id} fullWidth`}>
      <p>{parse(title.replace(/<br \/>/gi, ""))}</p>
      <div>
        <ReactEChartsCore echarts={echarts} option={option} />
      </div>
    </FullWidthContainer>
  );
};

export default BarCard;
