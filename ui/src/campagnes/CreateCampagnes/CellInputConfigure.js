import React from "react";
import { StyledInput } from "../CellInput/cellInput.style";

const CellInputConfigure = ({ id, name, type, placeholder, formik, ...rest }) => {
  return (
    <StyledInput
      iconId="fr-icon-pencil-line"
      state="default"
      stateRelatedMessage=""
      {...rest}
      nativeInputProps={{
        id: id,
        name: name,
        type: type,
        value: formik.values[id][name] || "",
        placeholder: placeholder,
        onChange: (e) => formik.setFieldValue(`${id}.${name}`, e.target.value),
      }}
    />
  );
};

export default CellInputConfigure;
