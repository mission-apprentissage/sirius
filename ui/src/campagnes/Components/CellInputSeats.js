import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Text,
  Box,
} from "@chakra-ui/react";
import { useSpring, animated } from "@react-spring/web";
import IoCheckmarkCircleOutline from "../../assets/icons/IoCheckmarkCircleOutline.svg";
import IoCloseCircleOutline from "../../assets/icons/IoCloseCircleOutline.svg";
import FiEdit from "../../assets/icons/FiEdit.svg";

const CellInputSeats = ({ id, name, info, handleCellUpdate, placeholder, ...props }) => {
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
    right: "30px",
    width: "20px",
    cursor: "pointer",
    onClick: submitHandler,
  };

  const seatsUnlimitedValue = value == "0" ? "Illimité" : value;

  return isEditing ? (
    <InputGroup w="150px">
      <NumberInput
        id={id}
        name={name}
        onChange={(e) => setValue(e)}
        value={value}
        size="md"
        fontSize="14px"
        step={1}
        min={0}
        max={150}
        ref={ref}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            return submitHandler();
          }
        }}
        {...props}
      >
        {value == "0" ? (
          <Input value="Illimité" onChange={() => null} pr="32px" />
        ) : (
          <NumberInputField
            placeholder={placeholder}
            _placeholder={props._placeholder}
            sx={{
              ...(isSuccess ? { border: "1px solid #48BB78" } : {}),
              ...(isFail ? { border: "1px solid red" } : {}),
            }}
          />
        )}
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <InputRightElement {...rightElementProps}>{rightElement}</InputRightElement>
    </InputGroup>
  ) : (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      w="100%"
      onDoubleClick={() => setIsEditing(true)}
    >
      <Text textAlign="center">{seatsUnlimitedValue}</Text>
      <Box cursor="pointer" ml="10px" onClick={() => setIsEditing(true)}>
        <Image src={FiEdit} alt="Édition" minW="12px" maxW="12px" />
      </Box>
    </Box>
  );
};

export default CellInputSeats;
