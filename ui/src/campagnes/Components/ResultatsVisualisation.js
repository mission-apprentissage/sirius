import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Image,
  useDisclosure,
  HStack,
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
import parse from "html-react-parser";
import { matchIdAndQuestions, matchCardTypeAndQuestions } from "../../utils/temoignage";
import { getCategoriesWithEmojis } from "../../campagnes/utils";
import GoEyeClosed from "../../assets/icons/GoEyeClosed.svg";
import GoEyeBlack from "../../assets/icons/GoEyeBlack.svg";
import GoEye from "../../assets/icons/GoEye.svg";
import VerbatimsModal from "./VerbatimsModal";

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

const ResultatsVisualisation = ({ campagne, temoignages }) => {
  const [matchedIdAndQuestions, setMatchedIdAndQuestions] = useState({});
  const [matchedCardTypeAndQuestions, setMatchedCardTypeAndQuestions] = useState({});
  const [isVerbatimsDisplayed, setIsVerbatimsDisplayed] = useState(true);
  const [modalData, setModalData] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (campagne) {
      setMatchedIdAndQuestions(matchIdAndQuestions(campagne));
      setMatchedCardTypeAndQuestions(matchCardTypeAndQuestions(campagne));
    }
  }, [campagne]);

  const categories = getCategoriesWithEmojis(campagne?.questionnaire);

  if (!campagne) return <Spinner />;

  return (
    <>
      <Box>
        <Text color="brand.blue.700" fontSize="5xl">
          <Text as="span" fontWeight="600">
            Résultats{" "}
          </Text>
          {campagne.nomCampagne || campagne.formation.data.intitule_long}
        </Text>
        <Box
          display="flex"
          flexDirection="row"
          mt="24px"
          mb="40px"
          cursor="pointer"
          onClick={() => setIsVerbatimsDisplayed(!isVerbatimsDisplayed)}
          w="max-content"
        >
          <Image
            w="20px"
            sizes=""
            src={isVerbatimsDisplayed ? GoEyeClosed : GoEyeBlack}
            alt=""
            mr="10px"
          />
          <Text color="brand.black.500">
            {isVerbatimsDisplayed ? "Masquer" : "Afficher"} tous les verbatims
          </Text>
        </Box>

        <Accordion allowToggle>
          {categories.map((category, index) => {
            const questionsList = Object.keys(
              campagne.questionnaire.properties[category.id].properties
            );

            const filteredQuestionsList = questionsList.filter((question) =>
              Object.keys(campagne.questionnaire.properties[category.id].properties).includes(
                question
              )
            );
            return (
              <AccordionItem
                key={index}
                bgColor="brand.blue.100"
                borderRadius="12px"
                border="none"
                my="12px"
                px="24px"
              >
                <AccordionButton
                  _hover={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Box
                    display="flex"
                    textAlign="left"
                    flexDirection="row"
                    alignItems="center"
                    w="100%"
                    my="15px"
                  >
                    <Text
                      fontSize="xl"
                      color="brand.blue.700"
                      fontWeight="600"
                      borderRight="2px solid #000091"
                      pr="16px"
                    >
                      {category.emoji}
                      <Text as="span" ml="5px">
                        {category.title}
                      </Text>
                    </Text>
                    <Text fontSize="md" color="brand.blue.700" ml="16px">
                      {questionsList.length} questions
                    </Text>
                  </Box>
                  <AccordionIcon color="brand.blue.700" fontSize="34px" />
                </AccordionButton>
                <AccordionPanel>
                  <Box display="flex" flexWrap="wrap">
                    {filteredQuestionsList.map((question) => {
                      const responses = temoignages
                        .map((temoignage) => temoignage.reponses[question])
                        .flat()
                        .filter(Boolean);

                      if (!isVerbatimsDisplayed && matchedCardTypeAndQuestions[question] === "text")
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
                            borderRadius="20px"
                            border="none"
                          >
                            <CardHeader>
                              <Heading
                                fontSize="xl"
                                textAlign="center"
                                color="brand.blue.700"
                                fontWeight="normal"
                                maxWidth={
                                  matchedCardTypeAndQuestions[question] === "text" ? "60%" : "100%"
                                }
                                lineHeight="28px"
                                margin="auto"
                              >
                                {parse(matchedIdAndQuestions[question])}
                              </Heading>
                            </CardHeader>
                            <CardBody>
                              {matchedCardTypeAndQuestions[question] === "text" && (
                                <Flex
                                  justifyContent="space-between"
                                  position="relative"
                                  alignItems="center"
                                  flexDirection="column"
                                  maxWidth="70%"
                                  margin="auto"
                                >
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="brand.black.500"
                                    mb="8px"
                                  >
                                    ({responses.length} témoignage
                                    {responses.length > 1 && "s"})
                                  </Text>
                                  {responses.map((response, index) => {
                                    if (index > 4) return null;

                                    return (
                                      <Text
                                        fontSize="md"
                                        color="brand.black.500"
                                        key={index}
                                        mb="8px"
                                        textAlign="center"
                                      >
                                        «
                                        {typeof response === "object"
                                          ? response?.content
                                          : response?.content || response || ""}
                                        »
                                      </Text>
                                    );
                                  })}
                                  {responses.length > 5 && (
                                    <HStack
                                      mt="32px"
                                      cursor="pointer"
                                      onClick={() => {
                                        setModalData({
                                          verbatims: responses,
                                          question: matchedIdAndQuestions[question],
                                        });
                                        onOpen();
                                      }}
                                    >
                                      <Image src={GoEye} />
                                      <Text textDecoration="underline" color="brand.blue.700">
                                        Voir tous les verbatim
                                      </Text>
                                    </HStack>
                                  )}
                                </Flex>
                              )}
                              {matchedCardTypeAndQuestions[question] === "pie" && (
                                <ReactEChartsCore
                                  echarts={echarts}
                                  option={pieOption(pieResponsesFormatting(responses))}
                                />
                              )}
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
                            </CardBody>
                          </Card>
                        )
                      );
                    })}
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Box>
      {modalData && (
        <VerbatimsModal
          isOpen={isOpen}
          onClose={onClose}
          verbatims={modalData.verbatims}
          question={modalData.question}
        />
      )}
    </>
  );
};

export default ResultatsVisualisation;
