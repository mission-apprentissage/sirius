import React, { useState } from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import InputText from "../../Components/Form/InputText";
import { formatDate } from "../utils";

import IoCheckmarkCircleOutline from "../../assets/icons/IoCheckmarkCircleOutline.svg";
import IoCloseCircleOutline from "../../assets/icons/IoCloseCircleOutline.svg";
import FiEdit from "../../assets/icons/FiEdit.svg";

const CellTextInput = ({
  id,
  name,
  info,
  handleCellUpdate = null,
  type,
  isEditingAtStart = false,
  placeholder = "",
  rightElement = null,
  rightElementProps = null,
  noRightElement = false,
  style = {},
  formik = null,
  onChange = null,
}) => {
  const [isEditing, setIsEditing] = useState(isEditingAtStart);
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
    type === "date" && !isEditingAtStart
      ? formatDate(value || info.getValue())
      : value || info.getValue();

  const rightElementClickHandler = async () => {
    const { _id, nomCampagne, startDate, endDate, seats, questionnaireId } = info.row.original;
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
  };

  const rightElementGetter = noRightElement ? null : rightElement ? (
    rightElement
  ) : (
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
  );

  const rightElementPropsGetter = noRightElement
    ? null
    : rightElementProps
    ? rightElementProps
    : {
        right: isNumber ? "40px" : "2px",
        top: isNumber ? "3px" : "0",
        width: "20px",
        cursor: "pointer",
        onClick: rightElementClickHandler,
      };

  const seatsUnlimitedValue = name === "seats" && value === 0 ? "Illimité" : value;

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
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
          placeholder={placeholder}
          noErrorMessage
          w={isNumber ? "150px" : "100%"}
          value={formik?.values[name] ? formik?.values[name] : seatsUnlimitedValue}
          onChange={
            onChange
              ? onChange
              : formik?.onChange
              ? formik.onChange
              : (e) => setValue(e.target?.value ? e.target.value : e)
          }
          size="md"
          fontSize="14px"
          p="4px"
          pr={isNumber ? "0" : "25px"}
          sx={{
            ...(isSuccess ? { border: "1px solid #48BB78" } : {}),
            ...(isFail ? { border: "1px solid red" } : {}),
            ...style,
          }}
          rightElement={rightElementGetter}
          rightElementProps={rightElementPropsGetter}
          _placeholder={{ color: "gray.600" }}
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
