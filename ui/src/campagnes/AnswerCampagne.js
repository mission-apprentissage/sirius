import React from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner } from "@chakra-ui/react";
import CustomCheckboxes from "../Components/Form/CustomCheckboxes";
import CustomRadios from "../Components/Form/CustomRadios";
import CustomTextWidget from "../Components/Form/CustomTextWidget";

const widgets = {
  CheckboxesWidget: CustomCheckboxes,
  RadioWidget: CustomRadios,
  TextWidget: CustomTextWidget,
};

const AnswerCampagne = () => {
  const { id } = useParams();
  const [campagne, loading, error] = useGet(`/api/campagnes/${id}`);

  const onChangeHandler = (data) => {
    console.log({ data });
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Form
      schema={campagne.questionnaire}
      uiSchema={campagne.questionnaireUI}
      validator={validator}
      widgets={widgets}
      onSubmit={() => console.log("submitted")}
      onError={() => console.log("errors")}
      onChange={onChangeHandler}
    />
  );
};

export default AnswerCampagne;
