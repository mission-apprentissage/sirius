import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { stopJob } from "../queries/jobs";

const useStopJob = () => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (jobId) => stopJob({ jobId, token: userContext.token }),
    mutationKey: "stop-job",
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
    },
  });

  return { mutate, stoppedJob: data, isSuccess, isError, isLoading };
};

export default useStopJob;
