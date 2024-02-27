import React, { useState, useRef, useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { formatDate } from "../utils";
import { NotEditingContainer, StyledInput } from "./cellInput.style";

const CellTextInput = ({ id, name, campagne, handleCellUpdate = null, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(campagne[name]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const ref = useRef(null);

  const displayedValue = type === "date" ? formatDate(value || campagne[name]) : value;

  const submitHandler = async () => {
    const { _id, nomCampagne, startDate, endDate, seats, questionnaireId } = campagne;
    const result = await handleCellUpdate(_id, {
      nomCampagne,
      startDate,
      endDate,
      seats,
      questionnaireId,
      [name]: value,
    });
    if (result.status === "success") {
      setIsSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setIsSuccess(false);
      }, 1500);
      setValue(value);
    } else {
      setIsFail(true);
      setValue(campagne[name]);
      setTimeout(() => {
        setIsEditing(false);
        setIsFail(false);
      }, 1500);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        submitHandler();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [value]);

  const iconId = isSuccess
    ? "fr-icon-success-line"
    : isFail
    ? "fr-icon-error-line"
    : "fr-icon-pencil-line";

  const state = isSuccess ? "success" : isFail ? "error" : "default";

  return (
    <>
      {isEditing ? (
        <StyledInput
          id={id}
          name={name}
          iconId={iconId}
          state={state}
          stateRelatedMessage=""
          nativeInputProps={{
            type: type,
            value: value,
            onChange: (e) => setValue(e.target?.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                return submitHandler();
              }
            },
          }}
          ref={ref}
        />
      ) : (
        <NotEditingContainer>
          {displayedValue && <p>{displayedValue}</p>}
          <span
            onClick={() => setIsEditing(true)}
            className={fr.cx("fr-icon--sm fr-icon-pencil-line")}
          />
        </NotEditingContainer>
      )}
    </>
  );
};

export default CellTextInput;
