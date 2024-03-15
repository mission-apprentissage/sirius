import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { isPlural } from "../../utils";

const CheckboxLabel = ({ count }) => (
  <b>
    {count
      ? `${count} formation${isPlural(count)} sélectionnée${isPlural(count)}`
      : "Tout sélectionner"}
  </b>
);

const SelectAllCheckbox = ({
  element,
  isChecked,
  setSelectedFormations,
  formationsByElement,
  existingFormationIdsFromCampagnes,
  count,
}) => {
  return (
    <Checkbox
      options={[
        {
          label: <CheckboxLabel count={count} />,
          nativeInputProps: {
            name: `selectAll${element}`,
            checked: isChecked,
            onChange: (e) => {
              setSelectedFormations((prevValues) => {
                if (e.target.checked) {
                  return [
                    ...new Set([
                      ...prevValues,
                      ...formationsByElement
                        .filter(
                          (formation) => !existingFormationIdsFromCampagnes.includes(formation._id)
                        )
                        .map((formation) => formation._id),
                    ]),
                  ];
                } else {
                  return prevValues.filter(
                    (selectedElement) =>
                      !formationsByElement.map((element) => element._id).includes(selectedElement)
                  );
                }
              });
            },
          },
        },
      ]}
    />
  );
};

export default SelectAllCheckbox;
