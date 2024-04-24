import ReactEChartsCore from "echarts-for-react/lib/core";
import parse from "html-react-parser";
import { FullWidthContainer } from "../../styles/resultsCampagnes.style";

const colors = ["#F95C5E", "#FCBFB7", "#C3FAD5", "#6A6AEC"];

const barOption = (responses) => {
  const labelFormatter = (param) => {
    if (param.data == 0) return "";
    return param.data;
  };

  const series = responses.data.map((response, index) => {
    return {
      name: response.emoji,
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
      data: responses.questions,
    },
    series: series,
  };
};

export const BarCard = ({ id, echarts, responses, title }) => {
  return (
    <FullWidthContainer className={`exportCharts-${id} fullWidth`}>
      <p>{parse(title.replace(/<br \/>/gi, ""))}</p>
      <div>
        <ReactEChartsCore echarts={echarts} option={barOption(responses)} />
      </div>
    </FullWidthContainer>
  );
};

export default BarCard;
