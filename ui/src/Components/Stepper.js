import React from "react";
import { Step, Steps } from "chakra-ui-steps";
import { Flex, useBreakpoint } from "@chakra-ui/react";

export const Stepper = ({ categories, currentCategoryIndex, children }) => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Flex flexDir="column" width="100%">
      <Steps
        activeStep={currentCategoryIndex}
        labelOrientation="vertical"
        colorScheme="purple"
        size={isMobile ? "sm" : "md"}
        orientation="horizontal"
      >
        {categories.map((category, index) => (
          <Step key={index} label={category}>
            {children}
          </Step>
        ))}
      </Steps>
    </Flex>
  );
};