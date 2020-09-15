import React, { useContext, useEffect } from "react";
import { delay } from "lodash-es";
import QuestionContext from "./QuestionContext";

const Auto = ({ timeout = 3000 }) => {
  let { next } = useContext(QuestionContext);

  useEffect(() => {
    delay(() => next(), timeout, true);
  }, [next, timeout]);

  return <div className={"Auto"} />;
};

export default Auto;
