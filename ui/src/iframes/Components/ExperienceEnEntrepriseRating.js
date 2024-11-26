import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { Table } from "@codegouvfr/react-dsfr/Table";
import ReactECharts from "echarts-for-react";
import React, { useState } from "react";

import { isPlural } from "../../campagnes/utils";
import { DATAVIZ_VIEW_TYPES } from "../../constants";
import useBreakpoints from "../../hooks/useBreakpoints";
import useMatomoEvent from "../../hooks/useMatomoEvent";
import { MATOMO_ACTION, MATOMO_CATEGORY } from "../../matomo";
import { ExperienceEnEntrepriseRatingChartsContainer, ExperienceEnEntrepriseRatingContainer } from "./shared.style";

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

const getTopLabelPosition = (index, isMobile) => {
  switch (index) {
    case 0:
      return isMobile ? "100px" : "100px";
    case 1:
      return isMobile ? "175px" : "160px";
    case 2:
      return isMobile ? "250px" : "215px";
    case 3:
      return isMobile ? "325px" : "270px";
    case 4:
      return isMobile ? "400px" : "320px";
  }
};

const chartOptions = (data, isMobile, onChartClick) => {
  const { labels, bienData, moyenData, malData } = processData(data);

  return {
    title: {
      text: "Thématiques",
      padding: 0,
      top: 0,
      textStyle: {
        fontFamily: "Marianne",
        fontSize: "14px",
        fontWeight: "700",
        color: "#161616",
        textAlign: "left",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) => tooltipFormatter(params, data),
      show: isMobile ? false : true,
      axisPointer: {
        type: "none",
        shadowStyle: {
          color: "rgba(0, 0, 0, 0.1)",
          shadowBlur: 0,
          width: 10,
        },
      },
    },
    legend: {
      data: ["Bien", "Moyen", "Mal"],
      orient: "horizontal",
      ...(isMobile ? { left: "0%" } : { right: "0%" }),
      top: isMobile ? 30 : 0,
      itemGap: isMobile ? 30 : 40,
      textStyle: {
        fontFamily: "Marianne",
        fontSize: "14px",
        fontWeight: "700",
        color: "#3A3A3A",
      },
    },
    grid: {
      left: isMobile ? 0 : "34%",
      right: 0,
      top: isMobile ? 80 : 25,
      bottom: 0,
      containLabel: false,
    },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: labels,
      inverse: true,
      triggerEvent: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    graphic: [
      {
        type: "group",
        left: 0,
        top: isMobile ? 80 : 40,
        children: labels.map((label, index) => ({
          type: "text",
          top: getTopLabelPosition(index, isMobile),
          onclick: () => onChartClick(label),
          style: {
            text: label,
            fontSize: 14,
            fontFamily: "Marianne",
            fontWeight: "400",
            fill: "#161616",
            width: isMobile ? "100%" : 230,
            textAlign: "left",
            cursor: "pointer",
            overflow: "break",
          },
        })),
      },
    ],
    series: [
      {
        name: "Bien",
        type: "bar",
        stack: "total",
        barCategoryGap: isMobile ? "40px" : 0,
        barWidth: "40px",
        label: {
          show: true,
          position: "inside",
          formatter: (params) => (params.value < 8 ? "" : params.value + "%"),
          fontFamily: "Marianne",
          fontSize: 12,
          color: "#161616",
          fontWeight: "700",
        },
        itemStyle: {
          color: "#6FE49D",
          borderRadius: [8, 8, 8, 8],
          borderWidth: 6,
          borderColor: "transparent",
        },
        data: bienData,
      },
      {
        name: "Moyen",
        type: "bar",
        stack: "total",
        barCategoryGap: isMobile ? "40px" : 0,
        barWidth: "40px",
        label: {
          show: true,
          position: "inside",
          formatter: (params) => (params.value < 8 ? "" : params.value + "%"),
          fontFamily: "Marianne",
          fontSize: 12,
          color: "#FFFFFF",
          fontWeight: "700",
        },
        itemStyle: {
          color: "#6A6AEC",
          borderRadius: [8, 8, 8, 8],
          borderWidth: 6,
          borderColor: "transparent",
        },
        data: moyenData,
      },
      {
        name: "Mal",
        type: "bar",
        stack: "total",
        barCategoryGap: isMobile ? "40px" : 0,
        barWidth: "40px",
        label: {
          show: true,
          position: "inside",
          formatter: (params) => (params.value < 8 ? "" : params.value + "%"),
          fontFamily: "Marianne",
          fontSize: 12,
          color: "#161616",
          fontWeight: "700",
        },
        itemStyle: {
          color: "#FCC0B4",
          borderRadius: [8, 8, 8, 8],
          borderWidth: 6,
          borderColor: "transparent",
        },
        data: malData,
      },
    ],
  };
};

const headers = ["Thématique", "Bien", "Moyen", "Mal"];

const ExperienceEnEntrepriseRating = ({ data, etablissementsCount, setGoToThematic }) => {
  const [viewType, setViewType] = useState(DATAVIZ_VIEW_TYPES.GRAPHIC);
  const { isMobile } = useBreakpoints();
  const trackEvent = useMatomoEvent();

  const temoignagesCount = Object.values(data[0].results).reduce((acc, item) => acc + item.count, 0);

  const tableData = data.map((item) => [
    <a href="#" style={{ cursor: "pointer" }} onClick={() => setGoToThematic(item.label)} key={item.label}>
      {item.label}
    </a>,
    <>
      <b>{item.results.Bien.percentage}%</b> ({item.results.Bien.count})
    </>,
    <>
      <b>{item.results.Moyen.percentage}%</b> ({item.results.Moyen.count})
    </>,
    <>
      <b>{item.results["Pas ok"].percentage}%</b> ({item.results["Pas ok"].count})
    </>,
  ]);

  const onChartClick = (value) => {
    setGoToThematic(value);
    trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_THEMATIC_FROM_GRAPH, value);
  };

  return (
    <>
      <ExperienceEnEntrepriseRatingContainer>
        <div>
          <h4>L'expérience en entreprise</h4>
          <p>
            {temoignagesCount} apprentis interrogés dans {etablissementsCount} établissement
            {isPlural(etablissementsCount)}
          </p>
        </div>
        <SegmentedControl
          small
          segments={[
            {
              iconId: "fr-icon-bar-chart-box-line",
              label: "Graphique",
              nativeInputProps: {
                checked: viewType === DATAVIZ_VIEW_TYPES.GRAPHIC,
                onClick: () => {
                  setViewType(DATAVIZ_VIEW_TYPES.GRAPHIC);
                  trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_GRAPHIC_VIEW);
                },
                readOnly: true,
              },
            },
            {
              iconId: "fr-icon-menu-fill",
              label: "Tableau",
              nativeInputProps: {
                checked: viewType === DATAVIZ_VIEW_TYPES.TABLE,
                onClick: () => {
                  setViewType(DATAVIZ_VIEW_TYPES.TABLE);
                  trackEvent(MATOMO_CATEGORY.IFRAME_FORMATION, MATOMO_ACTION.CLICK_TABLE_VIEW);
                },
                readOnly: true,
              },
            },
          ]}
        />
      </ExperienceEnEntrepriseRatingContainer>
      <ExperienceEnEntrepriseRatingChartsContainer>
        {viewType === DATAVIZ_VIEW_TYPES.GRAPHIC ? (
          <ReactECharts
            option={chartOptions(data, isMobile, onChartClick)}
            style={{ height: isMobile ? "450px" : "300px", width: "100%" }}
          />
        ) : null}
        {viewType === DATAVIZ_VIEW_TYPES.TABLE ? (
          <Table containerWidth="100%" headers={headers} data={tableData} />
        ) : null}
      </ExperienceEnEntrepriseRatingChartsContainer>
    </>
  );
};

export default ExperienceEnEntrepriseRating;
