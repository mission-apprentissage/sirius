import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { patchVerbatims } from "../queries/verbatims";

const usePatchVerbatims = () => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (verbatims) => patchVerbatims({ verbatims, token: userContext.token }),
    mutationKey: "patchVerbatims",
    onSuccess: () => {
      queryClient.invalidateQueries(["verbatims", "verbatims-count"]);
    },
  });

  return { mutate, patchedVerbatims: data, isSuccess, isError, isLoading };
};

export default usePatchVerbatims;
