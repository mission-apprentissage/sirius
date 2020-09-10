import React, { useContext, useEffect } from "react";
import { delay as waitFor } from "lodash-es";
import InputContext from "./QuestionContext";

const Auto = ({ delay = 3000 }) => {
  let { question, onReponse } = useContext(InputContext);

  useEffect(() => {
    waitFor(() => onReponse({ id: question.id }), delay, true);
  }, [delay, onReponse, question.id]);

  return <div className={"Auto"} />;
};

export default Auto;
