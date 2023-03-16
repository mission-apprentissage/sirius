import React from "react";
import { Step, Steps } from "chakra-ui-steps";
import { Flex, useBreakpoint } from "@chakra-ui/react";

export const Stepper = ({
  categories,
  currentCategoryIndex,
  setCurrentCategoryIndex,
  isTemoignageSent,
  children,
}) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Flex flexDir="column" width="100%">
      <Steps
        activeStep={currentCategoryIndex}
        colorScheme="purple"
        size={isMobile ? "sm" : "md"}
        orientation="horizontal"
        variant="circles-alt"
        onClickStep={(stepIndex) =>
          currentCategoryIndex > stepIndex && setCurrentCategoryIndex(stepIndex)
        }
      >
        {categories.map((category, index) => (
          <Step
            key={index}
            label={category}
            isCompletedStep={index < currentCategoryIndex || isTemoignageSent ? true : false}
          >
            {children}
          </Step>
        ))}
      </Steps>
    </Flex>
  );
};
