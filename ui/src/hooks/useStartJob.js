import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { startJob } from "../queries/jobs";

const useStartJob = () => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (jobType) => startJob({ jobType, token: userContext.token }),
    mutationKey: "start-job",
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });

  return { mutate, startedJob: data, isSuccess, isError, isLoading };
};

export default useStartJob;
