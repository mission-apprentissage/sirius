import React, { useState, useRef, useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { NotEditingContainer, StyledInput } from "./cellInput.style";
import { numberRegex } from "../../../constants";

const CellInputSeats = ({ id, name, campagne, handleCellUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(campagne[name]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const ref = useRef(null);

  const submitHandler = async () => {
    const { id, nomCampagne, startDate, endDate, seats, questionnaireId } = campagne;

    const result = await handleCellUpdate(id, {
      nomCampagne,
      startDate,
      endDate,
      seats,
      questionnaireId,
      [name]: value ? parseInt(value) : 0,
    });
    if (result.status === "success") {
      setIsSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setIsSuccess(false);
      }, 800);
      setValue(value);
    } else {
      setIsFail(true);
      setValue(campagne[name]);
      setTimeout(() => {
        setIsEditing(false);
        setIsFail(false);
      }, 800);
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

  const seatsUnlimitedValue = value == "0" || !value ? "Illimité" : value;

  const iconId = isSuccess
    ? "fr-icon-success-line"
    : isFail
    ? "fr-icon-error-line"
    : "fr-icon-pencil-line";

  const state = isSuccess ? "success" : isFail ? "error" : "default";

  return isEditing ? (
    <StyledInput
      iconId={iconId}
      state={state}
      stateRelatedMessage=""
      nativeInputProps={{
        id: id,
        name: name,
        placeholder: "Illimité",
        value: value == "0" ? "Illimité" : value,
        inputMode: "numeric",
        pattern: numberRegex,
        type: "number",
        step: 1,
        min: 0,
        max: 150,
        ref: ref,
        onChange: (e) =>
          e.target?.value === "" || numberRegex.test(e.target?.value)
            ? setValue(e.target?.value)
            : null,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            return submitHandler();
          }
        },
      }}
    />
  ) : (
    <NotEditingContainer onClick={() => setIsEditing(true)}>
      <p>{seatsUnlimitedValue}</p>
      <span className={fr.cx("fr-icon--sm fr-icon-pencil-line")} />
    </NotEditingContainer>
  );
};

export default CellInputSeats;
