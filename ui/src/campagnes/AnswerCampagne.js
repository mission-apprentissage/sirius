import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { Box, Flex, Button, useBreakpoint } from "@chakra-ui/react";
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
} from "../Components/Form/widgets";
import { CustomNestedRadios } from "../Components/Form/fields";
import { Stepper } from "../Components/Stepper";
import Hero from "../Components/Form/Hero";
import Success from "../Components/Form/Success";
import {
  multiStepQuestionnaireFormatter,
  multiStepQuestionnaireUIFormatter,
  getCategoriesWithEmojis,
  transformErrors,
  getNextButtonLabel,
} from "./utils";
import ErrorTemplate from "../Components/Form/ErrorTemplate";

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
};

const fields = {
  nestedRadios: CustomNestedRadios,
};

const AnswerCampagne = () => {
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
  const breakpoint = useBreakpoint({ ssr: false });
  const [nestedData, setNestedData] = useState({});
  const isMobile = breakpoint === "base";

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
    }
  }, [campagne]);

  const onSubmitHandler = async (formData, isLastQuestion) => {
    if (!temoignageId) {
      const result = await _post(`/api/temoignages/`, {
        reponses: { ...answers, ...formData, ...nestedData },
        campagneId: id,
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
      const result = await _put(`/api/temoignages/${temoignageId}`, {
        reponses: { ...answers, ...formData, ...nestedData },
      });
      if (!result.acknowledged) {
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
        <Box
          bg="white"
          p={6}
          rounded="md"
          w={isMobile ? "100%" : "80%"}
          m="auto"
          boxShadow="md"
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
                  colorScheme="purple"
                  rightIcon={<ChevronRightIcon />}
                  mt="25px"
                >
                  {getNextButtonLabel(isLastCategory, isLastQuestionInCategory)}
                </Button>
              </Box>
            </Form>
          </>
        </Box>
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

export default AnswerCampagne;
