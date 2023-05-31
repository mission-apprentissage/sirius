import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Flex,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useGet } from "../common/hooks/httpHooks";
import { _get } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import {
  matchIdAndQuestions,
  matchCardTypeAndQuestions,
  getMedianDuration,
} from "../utils/temoignage";
import { getCategoriesWithEmojis } from "../campagnes/utils";
import TemoignagesModal from "./Components/TemoignagesModal";

echarts.use([TooltipComponent, GridComponent, PieChart, CanvasRenderer, LegendComponent, BarChart]);

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
      radius: "60%",
      center: ["50%", "50%"],
      data: countedResponses,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
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

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
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
        },
        emphasis: {
          focus: "series",
        },
        data: zero,
        color: "#EE6766",
      },
      {
        name: "🧐",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: one,
        color: "#FAC858",
      },
      {
        name: "😊",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: two,
        color: "#91CC75",
      },
      {
        name: "😝",
        type: "bar",
        stack: "total",
        label: {
          show: true,
        },
        emphasis: {
          focus: "series",
        },
        data: three,
        color: "#5470C6",
      },
    ],
  };
};

const ViewTemoignages = () => {
  const [userContext] = useContext(UserContext);
  const [campagnes, loadingCampagnes, errorCampagnes] = useGet(`/api/campagnes/`);
  const [allCampagnes, setAllCampagnes] = useState([]);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [temoignages, setTemoignages] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [matchedIdAndQuestions, setMatchedIdAndQuestions] = useState({});
  const [matchedCardTypeAndQuestions, setMatchedCardTypeAndQuestions] = useState({});

  useEffect(() => {
    if (campagnes) {
      setAllCampagnes(campagnes);
    }
  }, [campagnes]);

  useEffect(() => {
    const getTemoignages = async () => {
      if (selectedCampagne) {
        const result = await _get(
          `/api/temoignages?campagneId=${selectedCampagne._id}`,
          userContext.token
        );
        const uniqueQuestions = [
          ...new Set(result.map((temoignage) => Object.keys(temoignage.reponses)).flat()),
        ];
        setTemoignages(result);
        setQuestionsList(uniqueQuestions);
        setMatchedIdAndQuestions(matchIdAndQuestions(selectedCampagne));
        setMatchedCardTypeAndQuestions(matchCardTypeAndQuestions(selectedCampagne));
      }
    };
    getTemoignages();
  }, [selectedCampagne]);

  const categories = getCategoriesWithEmojis(selectedCampagne?.questionnaire);

  const medianDuration = getMedianDuration(temoignages);

  return (
    <Flex direction="column" w="80%" m="auto">
      <HStack mb={4}>
        <Text fontWeight="semibold">Filtrer par</Text>
        <Select
          id="nomCampagne"
          name="nomCampagne"
          variant="filled"
          isSearchable
          isLoading={loadingCampagnes}
          isDisabled={!!errorCampagnes}
          options={
            allCampagnes.length > 0 &&
            allCampagnes.map((campagne) => ({
              value: campagne._id,
              label: campagne.nomCampagne,
            }))
          }
          placeholder="Campagnes"
          onChange={({ value }) =>
            setSelectedCampagne(campagnes.find((campagne) => campagne._id === value))
          }
        />
      </HStack>
      {selectedCampagne && (
        <Flex w="100%">
          <Card textAlign="center" h="auto" w="150px" mx="2">
            <CardHeader p="2">
              <Heading size="md">{temoignages.length}</Heading>
            </CardHeader>
            <CardBody p="1">
              <Text>témoignage{temoignages.length > 1 && "s"}</Text>
            </CardBody>
          </Card>
          <Card textAlign="center" w="150px" mx="2">
            <CardHeader p="2">
              <Heading size="md">{questionsList.length}</Heading>
            </CardHeader>
            <CardBody p="1">
              <Text>question{questionsList.length > 1 && "s"}</Text>
            </CardBody>
          </Card>
          <Card textAlign="center" w="150px" mx="2">
            <CardHeader p="2">
              <Heading size="md">{medianDuration}</Heading>
            </CardHeader>
            <CardBody p="1">
              <Text>temps médian de passation</Text>
            </CardBody>
          </Card>
        </Flex>
      )}
      <Accordion allowMultiple mt="15px">
        {categories.length > 0 &&
          categories.map((category) => {
            const filteredQuestionsList = questionsList.filter((question) =>
              Object.keys(
                selectedCampagne.questionnaire.properties[category.id].properties
              ).includes(question)
            );
            return (
              <AccordionItem key={category.id}>
                <AccordionButton>
                  <Box display="flex" flexDirection="row" w="calc(100% - 15px)">
                    <Text fontSize="xl" mr="10px">
                      {category.emoji}
                    </Text>
                    <Text fontSize="xl">{category.title}</Text>
                  </Box>
                  <Box display="flex" w="15px">
                    <AccordionIcon />
                  </Box>
                </AccordionButton>
                <AccordionPanel>
                  {filteredQuestionsList.map((question) => {
                    const responses = temoignages
                      .map((temoignage) => temoignage.reponses[question])
                      .flat()
                      .filter(Boolean);
                    return (
                      matchedIdAndQuestions[question] && (
                        <Card key={question} width="100%" m="4">
                          <CardHeader>
                            <Heading size="md">{matchedIdAndQuestions[question]}</Heading>
                          </CardHeader>
                          <CardBody>
                            {matchedCardTypeAndQuestions[question] === "text" && (
                              <Flex
                                p={10}
                                justifyContent={"space-between"}
                                position={"relative"}
                                _after={{
                                  content: '""',
                                  position: "absolute",
                                  height: "21px",
                                  width: "29px",
                                  left: "35px",
                                  top: "-10px",
                                  backgroundSize: "cover",
                                  backgroundImage: `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='21' viewBox='0 0 29 21' fill='none'%3E%3Cpath d='M6.91391 21C4.56659 21 2.81678 20.2152 1.66446 18.6455C0.55482 17.0758 0 15.2515 0 13.1727C0 11.2636 0.405445 9.43939 1.21634 7.7C2.0699 5.91818 3.15821 4.3697 4.48124 3.05454C5.84695 1.69697 7.31935 0.678787 8.89845 0L13.3157 3.24545C11.5659 3.96667 9.98676 4.94242 8.57837 6.17273C7.21266 7.36061 6.25239 8.63333 5.69757 9.99091L6.01766 10.1818C6.27373 10.0121 6.55114 9.88485 6.84989 9.8C7.19132 9.71515 7.63944 9.67273 8.19426 9.67273C9.34658 9.67273 10.4776 10.097 11.5872 10.9455C12.7395 11.7939 13.3157 13.1091 13.3157 14.8909C13.3157 16.8848 12.6542 18.4121 11.3311 19.4727C10.0508 20.4909 8.57837 21 6.91391 21ZM22.5982 21C20.2509 21 18.5011 20.2152 17.3488 18.6455C16.2391 17.0758 15.6843 15.2515 15.6843 13.1727C15.6843 11.2636 16.0898 9.43939 16.9007 7.7C17.7542 5.91818 18.8425 4.3697 20.1656 3.05454C21.5313 1.69697 23.0037 0.678787 24.5828 0L29 3.24545C27.2502 3.96667 25.6711 4.94242 24.2627 6.17273C22.897 7.36061 21.9367 8.63333 21.3819 9.99091L21.702 10.1818C21.9581 10.0121 22.2355 9.88485 22.5342 9.8C22.8756 9.71515 23.3238 9.67273 23.8786 9.67273C25.0309 9.67273 26.1619 10.097 27.2715 10.9455C28.4238 11.7939 29 13.1091 29 14.8909C29 16.8848 28.3385 18.4121 27.0155 19.4727C25.7351 20.4909 24.2627 21 22.5982 21Z' fill='%239F7AEA'/%3E%3C/svg%3E")`,
                                }}
                              >
                                <Text fontSize="xl" fontWeight="semibold" pl={4}>
                                  {responses[0]}
                                </Text>
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
                          </CardBody>
                          {matchedCardTypeAndQuestions[question] === "text" && (
                            <TemoignagesModal
                              responses={responses}
                              question={matchedIdAndQuestions[question]}
                            />
                          )}
                        </Card>
                      )
                    );
                  })}
                </AccordionPanel>
              </AccordionItem>
            );
          })}
      </Accordion>
    </Flex>
  );
};

export default ViewTemoignages;
