import { useState, useEffect, useRef } from "react";
import Input from "@codegouvfr/react-dsfr/Input";
import { MenuContainer, MultSelectContainer, InputContainer } from "./MultiSelect.style";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { isPlural } from "../../campagnes/utils";

const MultiSelect = ({ options, name, placeholder = "", selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(selected || []);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);

  const displayedValues = values
    ?.map((value) => {
      const option = options.find((option) => option.value === value);
      return option ? option.label : value;
    })
    .join(", ");

  const handleChange = (e) => {
    const value = e.target.value;
    let updatedValues;
    if (values.includes(value)) {
      updatedValues = values.filter((v) => v !== value);
    } else {
      updatedValues = [...values, value];
    }
    setValues(updatedValues);
    setSelected(updatedValues);
  };

  useEffect(() => {
    if (!values?.length && selected?.length) {
      setValues(selected);
    }
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const formattedOptions = options.map((option) => ({
    label: option.label,
    hintText: option.hintText,
    nativeInputProps: {
      name: `multiselect-${name}-${option.value}`,
      value: option.value,
      onChange: handleChange,
      checked: values?.includes(option.value),
    },
  }));

  const formattedSearchedOptions = options
    .filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
    .map((option) => ({
      label: option.label,
      hintText: option.hintText,
      nativeInputProps: {
        name: `multiselect-${name}-${option.value}`,
        value: option.value,
        onChange: handleChange,
        checked: values?.includes(option.value),
      },
    }));

  return (
    <MultSelectContainer ref={dropdownRef}>
      <InputContainer>
        <Input
          data-tooltip-id={`multiselect-menu-${name}`}
          iconId="fr-icon-arrow-down-s-line"
          hintText={values?.length ? `${values.length} sélectionné${isPlural(values.length)}` : ""}
          disabled={!options?.length}
          nativeInputProps={{
            name,
            placeholder,
            readOnly: !isOpen,
            value: isOpen ? search : displayedValues,
            onClick: () => setIsOpen(!isOpen),
            onChange: (e) => setSearch(e.target.value),
          }}
        />
      </InputContainer>
      {isOpen && (
        <MenuContainer>
          {(search && formattedSearchedOptions.length) || (!search && formattedOptions.length) ? (
            <Checkbox options={search ? formattedSearchedOptions : formattedOptions} small />
          ) : (
            <p>Pas de résultats</p>
          )}
        </MenuContainer>
      )}
    </MultSelectContainer>
  );
};

export default MultiSelect;
