import React from "react";
import { useParams, useHistory } from "react-router-dom";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/chakra-ui";
import { useGet } from "../common/hooks/httpHooks";
import { Spinner, useToast } from "@chakra-ui/react";
import { _post } from "../utils/httpClient";
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
  const history = useHistory();
  const [campagne, loading, error] = useGet(`/api/campagnes/${id}`);
  const toast = useToast();

  const onChangeHandler = (data) => {
    console.log({ data });
  };

  const onSubmitHandler = async ({ formData }) => {
    const result = await _post(`/api/temoignages/`, { reponses: formData, campagneId: id });
    if (result._id) {
      history.push(`/temoignages/succes`);
    } else {
      toast({
        title: "Une erreur est survenue",
        description: "Merci de réessayer",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Form
      schema={campagne.questionnaire}
      uiSchema={campagne.questionnaireUI}
      validator={validator}
      widgets={widgets}
      onSubmit={onSubmitHandler}
      onError={() => console.log("errors")}
      onChange={onChangeHandler}
    />
  );
};

export default AnswerCampagne;
