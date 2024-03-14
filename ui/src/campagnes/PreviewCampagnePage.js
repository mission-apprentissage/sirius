import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { Box, Flex, Button, useBreakpoint } from "@chakra-ui/react";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
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
} from "./utils";
import ErrorTemplate from "./Shared/ErrorTemplate";

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

const PreviewCampagnePage = () => {
  const { id } = useParams();
  const [previewedQuestionnaire, loading] = useGet(`/api/questionnaires/${id}`);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formattedQuestionnnaire, setFormattedQuestionnnaire] = useState([]);
  const [formattedQuestionnnaireUI, setFormattedQuestionnnaireUI] = useState([]);
  const [answers, setAnswers] = useState({});
  const [categories, setCategories] = useState([]);
  const [isTemoignageSent, setIsTemoignageSent] = useState(false);
  const [startedAnswering, setStartedAnswering] = useState(false);
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  const isLastCategory = formattedQuestionnnaire.length
    ? currentCategoryIndex === formattedQuestionnnaire.length - 1
    : false;

  const isLastQuestionInCategory = formattedQuestionnnaire?.length
    ? currentQuestionIndex === formattedQuestionnnaire[currentCategoryIndex].properties.length - 1
    : false;

  useEffect(() => {
    if (
      previewedQuestionnaire.questionnaire &&
      Object.keys(previewedQuestionnaire.questionnaire).length
    ) {
      setFormattedQuestionnnaire(
        multiStepQuestionnaireFormatter(previewedQuestionnaire.questionnaire)
      );
      setCategories(getCategoriesWithEmojis(previewedQuestionnaire.questionnaire));
    }
    if (previewedQuestionnaire.questionnaireUI) {
      setFormattedQuestionnnaireUI(
        multiStepQuestionnaireUIFormatter(previewedQuestionnaire.questionnaireUI)
      );
    }
  }, [previewedQuestionnaire]);

  const onSubmitHandler = async (formData, isLastQuestion) => {
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
  };

  const handleNested = () => {
    return;
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
      )}
    </Flex>
  ) : (
    <Hero
      setStartedAnswering={setStartedAnswering}
      isMobile={isMobile}
      startDate={new Date(0)}
      endDate={new Date("2030-09-13T00:00:00Z")}
      seats={previewedQuestionnaire.seats}
      temoignageCount={previewedQuestionnaire.temoignagesCount}
    />
  );
};

export default PreviewCampagnePage;
