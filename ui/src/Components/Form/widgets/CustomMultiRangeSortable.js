import React, { useState, useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderThumb,
  Box,
  useBreakpoint,
  FormLabel,
  SliderFilledTrack,
  Badge,
  ListItem,
  OrderedList,
  SliderMark,
} from "@chakra-ui/react";
import { DragHandleIcon } from "@chakra-ui/icons";
import { ReactSortable } from "react-sortablejs";

const emojiGetter = (value) => {
  switch (value) {
    case 0:
      return "😫";
    case 1:
      return "🧐";
    case 2:
      return "😊";
    case 3:
      return "😝";
  }
};

const CustomMultiRangeSortable = (props) => {
  const [list, setList] = useState([]);
  const [isSliderClicked, setIsSliderClicked] = useState(null);
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";
  const labels = props.uiSchema.labels || ["Très difficile", "Difficile", "Facile", "Très facile"];

  useEffect(() => {
    if (list.length === 0) {
      setList(
        props.schema.questions.map((question, index) => ({
          label: question,
          id: index,
          value: 0,
        }))
      );
    }
  }, []);

  useEffect(() => {
    if (list.length) {
      props.onChange(list);
    }
  }, [list]);

  return (
    <Box mx={isMobile ? "0" : "5"}>
      <FormLabel
        as="legend"
        fontSize="2xl"
        fontWeight="semibold"
        color="orange.500"
        requiredIndicator={
          <Badge bgColor="orange.500" color="white" ml="2">
            *
          </Badge>
        }
      >
        {props.schema.title}
      </FormLabel>
      <Box
        pt={2}
        pb={isMobile ? 6 : 2}
        w={isMobile ? "100%" : "90%"}
        m="auto"
        display="flex"
        flexDirection="row"
      >
        <ReactSortable
          list={list}
          setList={setList}
          animation={250}
          tag={OrderedList}
          style={{ listStyle: "none", marginLeft: "0" }}
        >
          {list.map((question, index) => {
            return (
              <ListItem
                key={question.id}
                w="100%"
                bgColor={index % 2 !== 0 ? "white" : "orange.100"}
                py="5"
                px="5"
                sx={{ counterIncrement: "custom" }}
                display="inline-flex"
                cursor="grab"
                borderLeft={isMobile ? "5px solid #CBD5E0" : "none"}
                mb={isMobile ? "5" : "0"}
                _before={{
                  content: isMobile ? "none" : `counter(custom) " "`,
                  width: "20px",
                  display: "inline-block",
                }}
              >
                <Box
                  display="flex"
                  flexDirection={isMobile ? "column" : "row"}
                  alignItems="center"
                  w="calc(100% - 20px)"
                >
                  <Box display="flex" w={isMobile ? "100%" : "50%"}>
                    <DragHandleIcon
                      display={isMobile ? "inherit" : "none"}
                      width="15px"
                      mr="15px"
                      color="gray.300"
                    />
                    <Box w="90%" textAlign="center">
                      {question?.label}
                    </Box>
                  </Box>
                  <Box w={isMobile ? "100%" : "50%"}>
                    <Slider
                      id="slider"
                      defaultValue={0}
                      min={0}
                      max={3}
                      colorScheme="orange"
                      w="100%"
                      height={isMobile ? "50px" : "inherit"}
                      onChangeStart={() => setIsSliderClicked(index)}
                      onChangeEnd={() => setIsSliderClicked(null)}
                      onChange={(value) => {
                        setList((prev) => {
                          prev[index] = { ...prev[index], value };
                          return prev;
                        });
                        props.onChange(list);
                      }}
                    >
                      {isSliderClicked === index && (
                        <SliderMark
                          value={list[index]?.value || 0}
                          textAlign="center"
                          bg="orange.500"
                          color="white"
                          mt="-40px"
                          ml="-55"
                          minWidth="100px"
                          px="2"
                          borderRadius="md"
                        >
                          {labels[list[index]?.value]}
                        </SliderMark>
                      )}
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb fontSize={26}>
                        {emojiGetter(list[index]?.value || 0)}
                      </SliderThumb>
                    </Slider>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </ReactSortable>
      </Box>
    </Box>
  );
};

export default CustomMultiRangeSortable;
