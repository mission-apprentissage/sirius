import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "../../../common/Flexbox";
import { ChevronIcon } from "../../../common/FontAwesome";
import QuestionContext from "./QuestionContext";
import { ChoiceButton, Option } from "../../toolkit";
import { pick } from "lodash-es";

const MultiChoice = ({ options }) => {
  let { next } = useContext(QuestionContext);
  let [selectedOptions, setOptionsSelected] = useState([]);

  return (
    <div className={"MultiChoise"}>
      <Box justify={"center"} wrap={"wrap"} direction={"column"}>
        {options.map((option, index) => {
          return (
            <Option
              key={index}
              selected={selectedOptions.filter((o) => o.id === option.id).length > 0}
              onClick={() => {
                if (option.next) {
                  let reponse = pick(option, ["id", "label", "satisfaction"]);
                  return next(reponse, { next: option.next });
                }

                let isAlreadySelected = selectedOptions.find((o) => o.id === option.id);
                if (isAlreadySelected) {
                  setOptionsSelected(selectedOptions.filter((o) => o.id !== option.id));
                } else {
                  setOptionsSelected([...selectedOptions, option]);
                }
              }}
            >
              {option.label}
            </Option>
          );
        })}
      </Box>
      <Box justify={"end"}>
        <ChoiceButton
          disabled={selectedOptions.length === 0}
          onClick={() => {
            let reponses = selectedOptions.map((option) => pick(option, ["id", "label", "satisfaction"]));
            return next(reponses);
          }}
        >
          <Box justify={"between"} align={"center"}>
            <span>Suivant</span>
            <ChevronIcon left />
          </Box>
        </ChoiceButton>
      </Box>
    </div>
  );
};
MultiChoice.propTypes = {
  options: PropTypes.array,
  next: PropTypes.string,
  onReponse: PropTypes.func,
};

export default MultiChoice;
