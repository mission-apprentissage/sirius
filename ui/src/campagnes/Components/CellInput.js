import React, { useState, useRef, useEffect } from "react";
import { Box, Text, Image, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import { formatDate } from "../utils";

import IoCheckmarkCircleOutline from "../../assets/icons/IoCheckmarkCircleOutline.svg";
import IoCloseCircleOutline from "../../assets/icons/IoCloseCircleOutline.svg";
import FiEdit from "../../assets/icons/FiEdit.svg";

const CellTextInput = ({ id, name, info, handleCellUpdate = null, type }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(info.getValue());
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const ref = useRef(null);

  const rightElementSpring = useSpring({
    opacity: isSuccess || isFail ? 0 : 1,
    transform: isSuccess || isFail ? "translateY(-20px)" : "translateY(0px)",
    config: { duration: 800, delay: 200 },
  });

  const displayedValue = type === "date" ? formatDate(value || info.getValue()) : value;

  const submitHandler = async () => {
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
      setValue(value);
    } else {
      setIsFail(true);
      setValue(info.getValue());
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

  const rightElement = (
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

  const rightElementProps = {
    right: "2px",
    top: "0",
    width: "20px",
    cursor: "pointer",
    onClick: submitHandler,
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <InputGroup>
          <Input
            id={id}
            name={name}
            type={type}
            onChange={(e) => setValue(e.target?.value)}
            value={value}
            size="md"
            color="brand.black.500"
            _placeholder={{ color: "brand.black.500" }}
            borderColor="brand.blue.400"
            p="4px"
            pr="25px"
            sx={{
              ...(isSuccess ? { border: "1px solid #48BB78" } : {}),
              ...(isFail ? { border: "1px solid red" } : {}),
            }}
            rightElement={rightElement}
            rightElementProps={rightElementProps}
            ref={ref}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                return submitHandler();
              }
            }}
          />
          <InputRightElement {...rightElementProps}>{rightElement}</InputRightElement>
        </InputGroup>
      ) : (
        <>
          <Text w="calc(100% - 22px)" textAlign={type === "number" ? "center" : "left"}>
            {displayedValue}
          </Text>
          <Box cursor="pointer" ml="10px" onClick={() => setIsEditing(true)}>
            <Image src={FiEdit} alt="Édition" minW="12px" maxW="12px" />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CellTextInput;
