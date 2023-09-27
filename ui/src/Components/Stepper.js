import React from "react";
import { Progress, useBreakpoint, Box, Text, Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export const Stepper = ({
  categories,
  currentCategoryIndex,
  setCurrentCategoryIndex,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const navigate = useNavigate();
  const isMobile = breakpoint === "base";

  if (categories.length === 0) return null;

  const goBackButtonLabelGetter = () => {
    if (currentCategoryIndex === 0 && currentQuestionIndex === 0) return "Quitter le questionnaire";
    if (currentQuestionIndex === 0) return "Revenir à la partie précédente";
    return "Précédent";
  };

  const goBackHandler = () => {
    if (currentCategoryIndex === 0 && currentQuestionIndex === 0) return navigate(0);
    if (currentQuestionIndex === 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentQuestionIndex(0);
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    return;
  };

  const progressValue = () => {
    let value = 0;
    for (let i = 0; i < currentCategoryIndex; i++) {
      value += categories[i].questionCount;
    }
    value += currentQuestionIndex;
    return (value * 100) / categories.reduce((acc, curr) => acc + curr.questionCount, 0);
  };

  return (
    <Box display="flex" flexDirection="column" w="100%">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent={isMobile ? "space-between" : "inherit"}
      >
        {categories.map((category, index) => {
          const isCurrent = index === currentCategoryIndex;
          const isFinished = index < currentCategoryIndex;
          const getBgColor = () => {
            if (isCurrent) return "brand.blue.700";
            if (isFinished) return "brand.blue.400";
            if (!isFinished && !isCurrent) return "brand.blue.100";
          };
          return (
            <Box
              key={index}
              justifyContent="flex-start"
              alignItems="center"
              mx="1"
              display="flex"
              flexDirection="column"
              w={isCurrent ? "auto" : "50px"}
              my={isMobile ? "2" : "0"}
            >
              <Box
                borderRadius={isCurrent ? "40px" : "100%"}
                bgColor={getBgColor}
                w={isCurrent ? "auto" : "50px"}
                h="50px"
                fontSize={isMobile ? "2xl" : "lg"}
                justifyContent="center"
                alignItems="center"
                display="flex"
                p={isCurrent ? "4" : "0"}
              >
                {category.emoji}
                {isCurrent && !isMobile && (
                  <Text color="white" fontSize="sm" textAlign="center" fontWeight="semibold" ml={2}>
                    {category.title}
                  </Text>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box w="100%" my="5">
        {isMobile && (
          <Text mb="2" color="brand.blue.700">
            {categories[currentCategoryIndex].title}
          </Text>
        )}
        <Progress colorScheme="progressBar" hasStripe isAnimated value={progressValue()} />
      </Box>
      <Box w="auto" mb="5">
        <Button
          size="xs"
          variant="solid"
          leftIcon={!isMobile && <ArrowBackIcon />}
          color="white"
          bgColor="brand.blue.700"
          colorScheme="brand.blue"
          onClick={goBackHandler}
        >
          {isMobile ? (
            <ArrowBackIcon />
          ) : (
            goBackButtonLabelGetter(currentCategoryIndex, currentQuestionIndex)
          )}
        </Button>
      </Box>
    </Box>
  );
};
