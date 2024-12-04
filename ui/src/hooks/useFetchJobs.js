import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchJobs } from "../queries/jobs";

const useFetchJobs = () => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobs({ token: userContext.token }),
  });

  return { jobs: data?.body, isSuccess, isError, isLoading };
};

export default useFetchJobs;
