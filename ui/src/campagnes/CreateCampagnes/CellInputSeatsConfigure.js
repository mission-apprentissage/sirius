import React from "react";
import { StyledInput } from "../CellInput/cellInput.style";
import { numberRegex } from "../../constants";

const CellInputSeatsConfigure = ({ id, name, formik, ...rest }) => {
  const handleChange = (e) => {
    if (numberRegex.test(e.target?.value)) {
      formik.setFieldValue(`${id}.${name}`, parseInt(e.target.value));
    }
    if (e.target?.value === "") {
      formik.setFieldValue(`${id}.${name}`, 0);
    }
  };
  return (
    <StyledInput
      iconId="fr-icon-pencil-line"
      state="default"
      {...rest}
      nativeInputProps={{
        id: id,
        name: name,
        placeholder: "Illimité",
        inputMode: "numeric",
        pattern: /[0-9]*/,
        value: formik.values[id][name] || "",
        onChange: handleChange,
      }}
    />
  );
};

export default CellInputSeatsConfigure;
