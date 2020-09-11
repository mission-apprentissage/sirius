import React, { useContext, useEffect } from "react";
import { delay } from "lodash-es";
import InputContext from "./QuestionContext";

const Auto = ({ timeout = 3000 }) => {
  let { question, onReponse } = useContext(InputContext);

  useEffect(() => {
    delay(() => onReponse({ id: question.id }), timeout, true);
  }, [timeout, onReponse, question.id]);

  return <div className={"Auto"} />;
};

export default Auto;
