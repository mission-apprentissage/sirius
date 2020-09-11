import React, { useRef, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { delay } from "lodash-es";
import { Entry, Avatar, Bubble } from "../../toolkit";
import Loading from "../../../common/Loading";

const scrollTo = (ref, timeout = 0, options = { block: "end", behavior: "smooth" }) => {
  delay((values) => ref.current.scrollIntoView(values), timeout, options);
};
function useHookWithRefCallback() {
  const ref = useRef(null);
  const setRef = useCallback((node) => {
    if (node) {
      ref.current = node;
    }
  }, []);

  return [ref, setRef];
}

const Question = ({ message, input, active }) => {
  let [showMessage, setShowMessage] = useState(!active);
  let showInput = !!(active && input);
  const [ref, setRef] = useHookWithRefCallback();

  useEffect(() => {
    if (!showMessage) {
      delay(setShowMessage, 1000, true);
    }
  }, [showMessage]);

  useEffect(() => {
    if (active && ref) {
      scrollTo(ref, 100);
    }
  }, [active, ref, showMessage]);

  return (
    <Entry align={"end"} width={"90%"} className={"Question"}>
      <Avatar />
      {showMessage ? (
        <Bubble animated={active}>
          {message}
          {showInput && input}
        </Bubble>
      ) : (
        <Loading />
      )}
      <div className={"bottom"} ref={setRef} />
    </Entry>
  );
};

Question.propTypes = {
  message: PropTypes.node.isRequired,
  active: PropTypes.bool,
  input: PropTypes.node,
  onData: PropTypes.func,
};

export default Question;
