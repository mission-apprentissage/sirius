import ReactECharts from "echarts-for-react";
import React from "react";

import { isPlural } from "../../campagnes/utils";
import { ExperienceEnEntrepriseRatingContainer } from "./shared.style";

const processData = (data) => {
  const labels = [];
  const bienData = [];
  const moyenData = [];
  const malData = [];

  data.forEach((item) => {
    labels.push(item.label.replace(/<[^>]*>/g, ""));
    bienData.push(item.results.Bien.percentage);
    moyenData.push(item.results.Moyen.percentage);
    malData.push(item.results["Pas ok"].percentage);
  });

  return { labels, bienData, moyenData, malData };
};

const tooltipFormatter = (params, data) => {
  let content = `<div style="font-weight: 400; margin-bottom: 8px; font-size: 12px">${params[0].axisValueLabel}</div>`;

  params.forEach((item) => {
    const seriesName = item.seriesName === "Mal" ? "Pas ok" : item.seriesName;
    const count = data[item.dataIndex]?.results[seriesName]?.count || 0;
    content += `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
        <span style="display: flex; align-items: center;">
          <span style="display: inline-block; width: 10px; height: 10px; background-color: ${item.color}; margin-right: 8px; border-radius: 2px;"></span>
          <span style="font-size: 14px">${item.seriesName}</span>
        </span>
        <span style="font-size: 14px">
          <b>${item.value}%</b> (${count})
        </span>
      </div>
    `;
  });

  return `<div style="width: 268px" >
    ${content}
  </div>`;
};

const chartOptions = (data) => {
  const { labels, bienData, moyenData, malData } = processData(data);

  return {
    tooltip: {
      trigger: "axis",
      formatter: (params) => tooltipFormatter(params, data),
      axisPointer: {
        type: "none",
        shadowStyle: {
          color: "rgba(0, 0, 0, 0.1)",
          shadowBlur: 0,
          width: "10",
        },
      },
    },
    legend: {
      data: ["Bien", "Moyen", "Mal"],
      orient: "horizontal",
      right: "2%",
      top: "0%",
      itemGap: 40,
      textStyle: {
        fontFamily: "Marianne",
        fontSize: "14px",
        fontWeight: "700",
        color: "#3A3A3A",
      },
    },
    grid: {
      left: -300,
      right: 0,
      top: 32,
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: labels,
      triggerEvent: true,
      axisLabel: {
        align: "left",
        margin: 320,
        fontFamily: "Marianne",
        fontSize: "14px",
        fontWeight: "400",
        color: "#161616",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "Bien",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          position: "inside",
          formatter: (params) => (params.value === 8 ? "" : params.value + "%"),
          fontFamily: "Marianne",
          fontSize: 12,
          color: "#161616",
        },
        itemStyle: {
          color: "#6FE49D",
        },
        data: bienData,
      },
      {
        name: "Moyen",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          position: "inside",
          formatter: (params) => (params.value === 8 ? "" : params.value + "%"),
          fontFamily: "Marianne",
          fontSize: 12,
          color: "#161616",
        },
        itemStyle: {
          color: "#EFCB3A",
        },
        data: moyenData,
      },
      {
        name: "Mal",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          position: "inside",
          formatter: (params) => (params.value < 8 ? "" : params.value + "%"),
          fontFamily: "Marianne",
          fontSize: 12,
          color: "#161616",
        },
        itemStyle: {
          color: "#FCC0B4",
        },
        data: malData,
      },
    ],
  };
};

const ExperienceEnEntrepriseRating = ({ data, etablissementsCount, setGoToThematic }) => {
  const temoignagesCount = Object.values(data[0].results).reduce((acc, item) => acc + item.count, 0);

  const onChartClick = (params) => {
    if (params.componentType === "yAxis") {
      setGoToThematic(params.value);
    }
  };

  return (
    <ExperienceEnEntrepriseRatingContainer>
      <h4>L'expérience en entreprise</h4>
      <p>
        {temoignagesCount} apprentis interrogés dans {etablissementsCount} établissement{isPlural(etablissementsCount)}
      </p>
      <ReactECharts
        option={chartOptions(data)}
        style={{ height: "300px", width: "100%" }}
        onEvents={{
          click: onChartClick,
        }}
      />
    </ExperienceEnEntrepriseRatingContainer>
  );
};

export default ExperienceEnEntrepriseRating;
