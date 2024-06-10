import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { Box, Flex, Button, useBreakpoint } from "@chakra-ui/react";
import { load } from "@fingerprintjs/botd";

import { useGet } from "../common/hooks/httpHooks";
import { Spinner, useToast } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { _post, _put } from "../utils/httpClient";
import {
  CustomCheckboxes,
  CustomMultiRange,
  CustomRadios,
  CustomRange,
  CustomText,
  CustomTextareaPrecision,
  CustomUpDown,
  CustomMessageReceived,
  CustomMultiRangeSortable,
  CustomEmojisRadios,
  CustomMultiEmojisRadios,
} from "./Shared/widgets";
import { CustomNestedRadios } from "./Shared/fields";
import { Stepper } from "../Components/Stepper";
import Hero from "./Shared/Hero";
import Success from "./Shared/Success";
import {
  multiStepQuestionnaireFormatter,
  multiStepQuestionnaireUIFormatter,
  getCategoriesWithEmojis,
  transformErrors,
  getNextButtonLabel,
  getChampsLibreField,
} from "./utils";
import ErrorTemplate from "./Shared/ErrorTemplate";
import BotDetectedModal from "./AnswerCampagne/BotDetectedModal";

const widgets = {
  CheckboxesWidget: CustomCheckboxes,
  RadioWidget: CustomRadios,
  TextWidget: CustomText,
  TextareaWidget: CustomTextareaPrecision,
  UpDownWidget: CustomUpDown,
  customRangeWidget: CustomRange,
  customMultiRangeWidget: CustomMultiRange,
  customMessageReceived: CustomMessageReceived,
  customMultiRangeSortableWidget: CustomMultiRangeSortable,
  customEmojiRadioWidget: CustomEmojisRadios,
  customMultiEmojiRadioWidget: CustomMultiEmojisRadios,
};

const fields = {
  nestedRadios: CustomNestedRadios,
};

const AnswerCampagnePage = () => {
  const { id } = useParams();
  const [campagne, loading] = useGet(`/api/campagnes/${id}`);
  const toast = useToast();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formattedQuestionnnaire, setFormattedQuestionnnaire] = useState([]);
  const [formattedQuestionnnaireUI, setFormattedQuestionnnaireUI] = useState([]);
  const [answers, setAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [isTemoignageSent, setIsTemoignageSent] = useState(false);
  const [temoignageId, setTemoignageId] = useState(null);
  const [startedAnswering, setStartedAnswering] = useState(false);
  const [isBot, setIsBot] = useState(false);
  const breakpoint = useBreakpoint({ ssr: false });
  const [nestedData, setNestedData] = useState({});
  const [champsLibresField, setChampsLibresField] = useState([]);
  const isMobile = breakpoint === "base";

  useEffect(() => {
    async function getBotdResult() {
      try {
        const botd = await load();
        const result = botd.detect();
        if (result.bot) {
          setIsBot(true);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getBotdResult();
  }, [currentQuestionIndex]);

  const isLastCategory = formattedQuestionnnaire.length
    ? currentCategoryIndex === formattedQuestionnnaire.length - 1
    : false;

  const isLastQuestionInCategory = formattedQuestionnnaire.length
    ? currentQuestionIndex === formattedQuestionnnaire[currentCategoryIndex].properties.length - 1
    : false;

  useEffect(() => {
    if (campagne.questionnaire && Object.keys(campagne.questionnaire).length) {
      setFormattedQuestionnnaire(multiStepQuestionnaireFormatter(campagne.questionnaire));
      setCategories(getCategoriesWithEmojis(campagne.questionnaire));
    }
    if (campagne.questionnaireUI) {
      setFormattedQuestionnnaireUI(multiStepQuestionnaireUIFormatter(campagne.questionnaireUI));
      setChampsLibresField(getChampsLibreField(campagne.questionnaireUI));
    }
  }, [campagne]);

  const onSubmitHandler = async (formData, isLastQuestion) => {
    if (!temoignageId) {
      const result = await _post(`/api/temoignages/`, {
        reponses: { ...answers, ...formData, ...nestedData },
        campagneId: id,
        lastQuestionAt: new Date(),
        isBot,
      });

      if (result._id) {
        setTemoignageId(result._id);
        if (isLastQuestion) {
          setIsTemoignageSent(true);
          return;
        } else if (isLastQuestionInCategory) {
          setCurrentCategoryIndex(currentCategoryIndex + 1);
          setCurrentQuestionIndex(0);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        setAnswers({ ...answers, ...formData });
      } else {
        if (result.statusCode === 403) {
          toast({
            title: "Une erreur est survenue",
            description: result.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Une erreur est survenue",
            description: "Merci de réessayer",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } else {
      const questionKey = Object.keys(
        formattedQuestionnnaire[currentCategoryIndex].properties[currentQuestionIndex].properties
      )[0];
      const isChampsLibre = champsLibresField.includes(questionKey);
      let result;

      if (isChampsLibre) {
        result = await _post(`/api/verbatims/`, {
          temoignageId,
          questionKey,
          content: formData[questionKey],
        });
      } else {
        const reponses = { ...answers, ...formData, ...nestedData };
        const reponsesWithoutChampsLibreFields = Object.keys(reponses).reduce((acc, key) => {
          if (!champsLibresField.includes(key)) {
            acc[key] = reponses[key];
          }
          return acc;
        }, {});

        result = await _put(`/api/temoignages/${temoignageId}`, {
          reponses: reponsesWithoutChampsLibreFields,
          lastQuestionAt: new Date(),
          isBot,
        });
      }

      if (
        !(isChampsLibre && result._id) &&
        !(isChampsLibre && result.acknowledged) &&
        !(!isChampsLibre && result.acknowledged)
      ) {
        if (result.statusCode === 403) {
          toast({
            title: "Une erreur est survenue",
            description: result.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Une erreur est survenue",
            description: "Merci de réessayer",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        if (isLastQuestion) {
          setIsTemoignageSent(true);
          return;
        } else if (isLastQuestionInCategory) {
          setCurrentCategoryIndex(currentCategoryIndex + 1);
          setCurrentQuestionIndex(0);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        setAnswers({ ...answers, ...formData });
      }
    }
  };

  const handleNested = (nestedFormData) => {
    setNestedData({ ...nestedFormData });
  };

  if (loading || !formattedQuestionnnaire.length) return <Spinner size="xl" />;

  return startedAnswering ? (
    <Flex my="20px" w={isMobile ? "100%" : "80%"} m="auto" pt={["0", "5"]}>
      {isTemoignageSent && <Success />}
      {!isTemoignageSent && (
        <>
          <Box
            bg="white"
            p={6}
            rounded="md"
            w={isMobile ? "100%" : "80%"}
            m="auto"
            minHeight={isMobile ? "100vh" : "inherit"}
          >
            <Stepper
              categories={categories}
              currentCategoryIndex={currentCategoryIndex}
              setCurrentCategoryIndex={setCurrentCategoryIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              isTemoignageSent={isTemoignageSent}
              currentQuestionIndex={currentQuestionIndex}
            />
            <>
              <Form
                schema={
                  formattedQuestionnnaire[currentCategoryIndex].properties[currentQuestionIndex]
                }
                uiSchema={formattedQuestionnnaireUI[currentCategoryIndex]}
                validator={validator}
                widgets={widgets}
                fields={fields}
                onSubmit={(values) =>
                  onSubmitHandler(values.formData, isLastCategory && isLastQuestionInCategory)
                }
                noHtml5Validate
                templates={{ FieldErrorTemplate: ErrorTemplate }}
                transformErrors={transformErrors}
                formData={answers}
                showErrorList={false}
                formContext={{ handleNested }}
              >
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    borderRadius="md"
                    type="submit"
                    variant="solid"
                    bgColor="brand.blue.700"
                    color="white"
                    colorScheme="brand.blue"
                    rightIcon={<ChevronRightIcon />}
                    mt="25px"
                  >
                    {getNextButtonLabel(isLastCategory, isLastQuestionInCategory)}
                  </Button>
                </Box>
              </Form>
            </>
          </Box>
          <BotDetectedModal isOpen={isBot} />
        </>
      )}
    </Flex>
  ) : (
    <Hero
      setStartedAnswering={setStartedAnswering}
      isMobile={isMobile}
      startDate={campagne.startDate}
      endDate={campagne.endDate}
      seats={campagne.seats}
      temoignageCount={campagne.temoignagesCount}
    />
  );
};

export default AnswerCampagnePage;
