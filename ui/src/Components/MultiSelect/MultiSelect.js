/* eslint-disable no-undef */

import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { useEffect, useRef, useState } from "react";

import { isPlural } from "../../campagnes/utils";
import { InputContainer, MenuContainer, MultSelectContainer } from "./MultiSelect.style";

const MultiSelect = ({ options, name, placeholder = "", label, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(selected || []);
  const [search, setSearch] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(false);
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
    setIsAllSelected(updatedValues.length === options.length);
  };

  useEffect(() => {
    if (!values?.length && selected?.length) {
      setValues(selected);
    }
    setIsAllSelected(selected?.length === options?.length);
  }, [selected]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setValues(options.map((option) => option.value));
      setSelected(options.map((option) => option.value));
      setIsAllSelected(true);
    } else {
      setValues([]);
      setIsAllSelected(false);
    }
  };

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
          label={label}
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
          <Checkbox
            options={[
              {
                label: isAllSelected ? "Tout désélectionner" : "Tout sélectionner",
                nativeInputProps: {
                  name: `multiselect-${name}-select-all`,
                  checked: isAllSelected,
                  onChange: handleSelectAll,
                },
              },
            ]}
            small
          />
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
