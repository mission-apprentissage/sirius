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
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

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
    <Box mx="5">
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
                _before={{
                  content: `counter(custom) " "`,
                  width: "20px",
                  display: "inline-block",
                }}
              >
                <Box display="flex" flexDirection="row" alignItems="center" w="calc(100% - 20px)">
                  <Box w="calc(50% - 25px)">{question?.label}</Box>
                  <Box w="50%">
                    <Slider
                      id="slider"
                      defaultValue={0}
                      min={0}
                      max={3}
                      colorScheme="orange"
                      w="100%"
                      height={isMobile ? "50px" : "inherit"}
                      onChange={(value) => {
                        setList((prev) => {
                          prev[index] = { ...prev[index], value };
                          return prev;
                        });
                        props.onChange(list);
                      }}
                    >
                      <SliderTrack colorScheme="orange">
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb fontSize={26}>{emojiGetter(list[index].value || 0)}</SliderThumb>
                    </Slider>
                  </Box>
                  <DragHandleIcon ml="5" />
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
