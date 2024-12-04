import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchJob } from "../queries/jobs";

const useFetchJob = (jobId) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: () => fetchJob({ jobId, token: userContext.token }),
    enabled: !!jobId,
    refetchInterval: 5000,
  });

  return { job: data?.body, isSuccess, isError, isLoading };
};

export default useFetchJob;
