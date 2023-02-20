import React from "react";
import { useParams } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner } from "@chakra-ui/react";
import CustomCheckboxes from "../Components/Form/CustomCheckboxes";

const widgets = {
  CheckboxesWidget: CustomCheckboxes,
};

const AnswerCampagne = () => {
  const { id } = useParams();
  const [campagne, loading, error] = useGet(`/api/campagnes/${id}`);

  if (loading) return <Spinner size="xl" />;

  return (
    <Form
      schema={campagne.questionnaire}
      uiSchema={campagne.questionnaireUI}
      validator={validator}
      widgets={widgets}
      onChange={() => console.log("changed")}
      onSubmit={() => console.log("submitted")}
      onError={() => console.log("errors")}
    />
  );
};

export default AnswerCampagne;
