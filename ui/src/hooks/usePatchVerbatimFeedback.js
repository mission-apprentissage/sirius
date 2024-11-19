import { useMutation } from "@tanstack/react-query";

import { patchVerbatimFeedback } from "../queries/verbatims";

const usePatchVerbatimFeedback = () => {
  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: ({ verbatimId, isUseful }) => patchVerbatimFeedback({ verbatimId, isUseful }),
    mutationKey: "patchVerbatimFeedback",
  });

  return { mutate, patchedVerbatimFeedback: data, isSuccess, isError, isLoading };
};

export default usePatchVerbatimFeedback;
