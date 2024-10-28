import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Spinner, useBreakpoint, useToast } from "@chakra-ui/react";
import { load } from "@fingerprintjs/botd";
// eslint-disable-next-line import/no-named-as-default
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv8";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGet } from "../common/hooks/httpHooks";
import { Stepper } from "../Components/Stepper";
import { VERBATIM_STATUS } from "../constants";
import { apiPost, apiPut } from "../utils/api.utils";
import BotDetectedModal from "./AnswerCampagne/BotDetectedModal";
import ErrorTemplate from "./Shared/ErrorTemplate";
import { CustomNestedRadios } from "./Shared/fields";
import Hero from "./Shared/Hero";
import Success from "./Shared/Success";
import {
  CustomCheckboxes,
  CustomEmojisRadios,
  CustomMessageReceived,
  CustomMultiEmojisRadios,
  CustomMultiRange,
  CustomMultiRangeSortable,
  CustomRadios,
  CustomRange,
  CustomText,
  CustomTextareaPrecision,
  CustomUpDown,
} from "./Shared/widgets";
import {
  getCategoriesWithEmojis,
  getChampsLibreField,
  getNextButtonLabel,
  multiStepQuestionnaireFormatter,
  multiStepQuestionnaireUIFormatter,
  transformErrors,
} from "./utils";

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

  const [campagne, loading] = useGet(`/api/campagnes/${id}`);

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
    if (campagne?.questionnaire?.questionnaire && Object.keys(campagne.questionnaire.questionnaire).length) {
      setFormattedQuestionnnaire(multiStepQuestionnaireFormatter(campagne.questionnaire.questionnaire));
      setCategories(getCategoriesWithEmojis(campagne.questionnaire.questionnaire));
    }
    if (campagne?.questionnaire?.questionnaireUI) {
      setFormattedQuestionnnaireUI(multiStepQuestionnaireUIFormatter(campagne.questionnaire.questionnaireUI));
      setChampsLibresField(getChampsLibreField(campagne.questionnaire.questionnaireUI));
    }
  }, [campagne]);

  const onSubmitHandler = async (formData, isLastQuestion) => {
    if (!temoignageId) {
      const result = await apiPost("/temoignages", {
        body: {
          reponses: { ...answers, ...formData, ...nestedData },
          campagneId: id,
          lastQuestionAt: new Date(),
          isBot,
        },
      });

      if (result) {
        setTemoignageId(result.id);
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

      const isTrimmedChampsLibreEmpty = isChampsLibre && !formData[questionKey]?.trim();

      if (isChampsLibre && !isTrimmedChampsLibreEmpty) {
        result = await apiPost("/verbatims", {
          body: {
            temoignageId,
            questionKey,
            content: formData[questionKey],
            status: VERBATIM_STATUS.PENDING,
          },
        });
      } else if (!isChampsLibre) {
        const reponses = { ...answers, ...formData, ...nestedData };
        const reponsesWithoutChampsLibreFields = Object.keys(reponses).reduce((acc, key) => {
          if (!champsLibresField.includes(key)) {
            acc[key] = reponses[key];
          }
          return acc;
        }, {});

        result = await apiPut(`/api/temoignages/:id`, {
          params: { id: temoignageId },
          body: {
            reponses: reponsesWithoutChampsLibreFields,
            lastQuestionAt: new Date(),
            isBot,
          },
        });
      }

      if (!(isChampsLibre && (result?.id || isTrimmedChampsLibreEmpty)) && !(!isChampsLibre && result === true)) {
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
                schema={formattedQuestionnnaire[currentCategoryIndex].properties[currentQuestionIndex]}
                uiSchema={formattedQuestionnnaireUI[currentCategoryIndex]}
                validator={validator}
                widgets={widgets}
                fields={fields}
                onSubmit={(values) => onSubmitHandler(values.formData, isLastCategory && isLastQuestionInCategory)}
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
