import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  HStack,
  Box,
  Tag,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
} from "@chakra-ui/react";
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
import { matchIdAndQuestions, matchCardTypeAndQuestions } from "../utils/temoignage";
import { getCategoriesWithEmojis } from "../campagnes/utils";
import DashboardHeader from "./Components/DashboardHeader";

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
  const colors = ["#9C4221", "#C05621", "#DD6B20", "#F6AD55", "#FBD38D"];
  if (length === 3) return ["#9C4221", "#DD6B20", "#FBD38D"];
  if (length === 2) return ["#9C4221", "#FBD38D"];
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
        color: "#652B19",
        overflow: "break",
        formatter: "{b} \n ({c} - {d}%)",
      },
      labelLine: {
        lineStyle: {
          color: "#652B19",
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
        color: "#9C4221",
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
        color: "#DD6B20",
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
        color: "#FAC858",
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
        color: "#91CC75",
      },
    ],
  };
};

const Dashboard = () => {
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [temoignages, setTemoignages] = useState([]);
  const [matchedIdAndQuestions, setMatchedIdAndQuestions] = useState({});
  const [matchedCardTypeAndQuestions, setMatchedCardTypeAndQuestions] = useState({});
  const [isVerbatimsDisplayed, setIsVerbatimsDisplayed] = useState(true);

  useEffect(() => {
    if (selectedCampagne) {
      setMatchedIdAndQuestions(matchIdAndQuestions(selectedCampagne));
      setMatchedCardTypeAndQuestions(matchCardTypeAndQuestions(selectedCampagne));
    }
  }, [selectedCampagne]);

  const categories = getCategoriesWithEmojis(selectedCampagne?.questionnaire);

  return (
    <Flex direction="column" w="100%" m="auto" bgColor="white">
      <Flex direction="column" w="100%" m="auto" bgColor="white">
        <DashboardHeader
          temoignagesSetter={setTemoignages}
          temoignages={temoignages}
          verbatimsDisplayedSetter={setIsVerbatimsDisplayed}
          campagneSetter={setSelectedCampagne}
          campagne={selectedCampagne}
          isVerbatimsDisplayed={isVerbatimsDisplayed}
        />
        {categories.length > 0 && (
          <Box w="calc(100% - 27px)" ml="27px" mt="60px">
            <Stepper
              size="lg"
              colorScheme="purple"
              orientation="vertical"
              index={categories.length}
            >
              {categories.map((category, index) => {
                const questionsList = Object.keys(
                  selectedCampagne.questionnaire.properties[category.id].properties
                );

                const filteredQuestionsList = questionsList.filter((question) =>
                  Object.keys(
                    selectedCampagne.questionnaire.properties[category.id].properties
                  ).includes(question)
                );
                return (
                  <Step key={index} w="100%">
                    <StepIndicator w="74px" h="74px" fontSize="40px">
                      <StepStatus complete={category.emoji} />
                    </StepIndicator>

                    <Box ml="28px" mt="10px" width="100%">
                      <HStack>
                        <Text fontSize="4xl" color="purple.600">
                          {category.title}
                        </Text>
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          borderLeft="2px solid #6B46C1"
                          px="32px"
                          ml="32px"
                        >
                          <Tag
                            fontSize="2xl"
                            colorScheme="purple"
                            color="purple.600"
                            fontWeight="semibold"
                            mr="5px"
                          >
                            {questionsList.length}
                          </Tag>
                          <Text fontSize="xl" color="purple.600">
                            QUESTIONS
                          </Text>
                        </Box>
                      </HStack>
                      <Box display="flex" flexWrap="wrap">
                        {filteredQuestionsList.map((question) => {
                          const responses = temoignages
                            .map((temoignage) => temoignage.reponses[question])
                            .flat()
                            .filter(Boolean);

                          if (
                            !isVerbatimsDisplayed &&
                            matchedCardTypeAndQuestions[question] === "text"
                          )
                            return null;
                          return (
                            matchedIdAndQuestions[question] && (
                              <Card
                                key={question}
                                width={
                                  matchedCardTypeAndQuestions[question] === "pie"
                                    ? "calc(50% - 72px)"
                                    : "calc(100% - 112px)"
                                }
                                m="4"
                                variant="outline"
                                borderColor="purple.600"
                                borderRadius="20px"
                              >
                                <CardHeader>
                                  <Heading
                                    fontSize="xl"
                                    textAlign="center"
                                    color="orange.500"
                                    fontWeight="normal"
                                    maxWidth={
                                      matchedCardTypeAndQuestions[question] === "text"
                                        ? "60%"
                                        : "100%"
                                    }
                                    lineHeight="28px"
                                    margin="auto"
                                  >
                                    {matchedIdAndQuestions[question]}
                                  </Heading>
                                </CardHeader>
                                <CardBody>
                                  {matchedCardTypeAndQuestions[question] === "text" && (
                                    <Flex
                                      justifyContent={"space-between"}
                                      position={"relative"}
                                      alignItems={"center"}
                                      flexDirection={"column"}
                                      maxWidth="70%"
                                      margin="auto"
                                    >
                                      <Text
                                        fontSize="sm"
                                        fontWeight="semibold"
                                        color="orange.900"
                                        mb="8px"
                                      >
                                        ({responses.length} témoignage{responses.length > 1 && "s"})
                                      </Text>
                                      {responses.map((response, index) => (
                                        <Text
                                          fontSize="md"
                                          color="orange.900"
                                          key={index}
                                          mb="8px"
                                          textAlign="center"
                                        >
                                          « {response} »
                                        </Text>
                                      ))}
                                    </Flex>
                                  )}
                                  {matchedCardTypeAndQuestions[question] === "pie" && (
                                    <ReactEChartsCore
                                      echarts={echarts}
                                      option={pieOption(pieResponsesFormatting(responses))}
                                    />
                                  )}
                                  {matchedCardTypeAndQuestions[question] === "bar" && (
                                    <ReactEChartsCore
                                      echarts={echarts}
                                      option={barOption(responses)}
                                    />
                                  )}
                                </CardBody>
                              </Card>
                            )
                          );
                        })}
                      </Box>
                    </Box>
                    <StepSeparator ml="17px" mt="20px" />
                  </Step>
                );
              })}
            </Stepper>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default Dashboard;
