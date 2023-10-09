import React, { useState } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import InputText from "../../Components/Form/InputText";
import { formatDate } from "../utils";

import IoCheckmarkCircleOutline from "../../assets/icons/IoCheckmarkCircleOutline.svg";
import IoCloseCircleOutline from "../../assets/icons/IoCloseCircleOutline.svg";
import FiEdit from "../../assets/icons/FiEdit.svg";

const CellTextInput = ({ id, name, info, handleCellUpdate, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(info.getValue());
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);

  const rightElementSpring = useSpring({
    opacity: isSuccess || isFail ? 0 : 1,
    transform: isSuccess || isFail ? "translateY(-20px)" : "translateY(0px)",
    config: { duration: 800, delay: 200 },
  });

  const isNumber = type === "number";

  const displayedValue =
    type === "date" ? formatDate(value || info.getValue()) : value || info.getValue();

  return (
    <Box display="flex" flexDirection="row" alignItems="center" w="100%">
      {!isEditing && (
        <Text w="calc(100% - 22px)" textAlign={type === "number" ? "center" : "left"}>
          {displayedValue}
        </Text>
      )}
      {isEditing && (
        <InputText
          id={id}
          name={name}
          type={type}
          noErrorMessage
          w={isNumber ? "150px" : "100%"}
          value={value}
          onChange={(e) => setValue(isNumber ? e : e.target.value)}
          size="md"
          fontSize="14px"
          p="4px"
          pr={isNumber ? "0" : "25px"}
          sx={{
            ...(isSuccess ? { border: "1px solid #48BB78" } : {}),
            ...(isFail ? { border: "1px solid red" } : {}),
          }}
          rightElement={
            <animated.div
              style={{
                ...rightElementSpring,
              }}
            >
              <Image
                src={isFail ? IoCloseCircleOutline : IoCheckmarkCircleOutline}
                minW="18px"
                maxW="18px"
              />
            </animated.div>
          }
          rightElementProps={{
            right: isNumber ? "40px" : "2px",
            top: isNumber ? "3px" : "0",
            width: "20px",
            cursor: "pointer",
            onClick: async () => {
              const { _id, nomCampagne, startDate, endDate, seats, questionnaireId } =
                info.row.original;
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
                }, 800);
              } else {
                setIsFail(true);
                setValue(info.getValue());
                setTimeout(() => {
                  setIsEditing(false);
                  setIsFail(false);
                }, 800);
              }
            },
          }}
        />
      )}
      {!isEditing && (
        <Box cursor="pointer" ml="10px" onClick={() => setIsEditing(true)}>
          <Image src={FiEdit} alt="Édition" minW="12px" maxW="12px" />
        </Box>
      )}
    </Box>
  );
};

export default CellTextInput;
