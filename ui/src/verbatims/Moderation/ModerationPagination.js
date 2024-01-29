import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useSearchParams } from "react-router-dom";

const ModerationPagination = ({ page, PAGE_SIZE, totalCount }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChangeHandler = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage);
    setSearchParams(newSearchParams);
  };

  return (
    <Box w="100%" display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <IconButton
        isDisabled={page === 1}
        onClick={() => onChangeHandler(page - 1)}
        size="sm"
        aria-label="Page précédente"
        icon={<ArrowLeftIcon />}
      />
      <Box mx="25px">
        <Text fontSize="sm">
          {(page - 1) * PAGE_SIZE} - {Math.min(page * PAGE_SIZE, totalCount)} sur {totalCount}
        </Text>
      </Box>
      <IconButton
        isDisabled={page * PAGE_SIZE >= totalCount}
        onClick={() => onChangeHandler(page + 1)}
        ml="2"
        size="sm"
        aria-label="Page suivante"
        icon={<ArrowRightIcon />}
      />
    </Box>
  );
};

export default ModerationPagination;
