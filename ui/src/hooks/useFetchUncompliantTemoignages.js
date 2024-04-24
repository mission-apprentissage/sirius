import { useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { fetchUncompliantTemoignages } from "../queries/temoignages";

const useFetchUncompliantTemoignages = ({
  type,
  duration,
  answeredQuestions,
  includeUnavailableDuration,
  page,
  pageSize = 100,
}) => {
  const queryClient = useQueryClient();

  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [
      "uncompliantTemoignages",
      type,
      page,
      duration,
      answeredQuestions,
      includeUnavailableDuration,
    ],
    queryFn: () =>
      fetchUncompliantTemoignages({
        type,
        duration,
        answeredQuestions,
        includeUnavailableDuration,
        page,
        pageSize,
        token: userContext.token,
      }),
  });

  useEffect(() => {
    if (data?.pagination?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [
          `uncompliantTemoignages`,
          type,
          page + 1,
          duration,
          answeredQuestions,
          includeUnavailableDuration,
        ],
        queryFn: () =>
          fetchUncompliantTemoignages({
            type,
            duration,
            answeredQuestions,
            includeUnavailableDuration,
            page: page + 1,
            pageSize,
            token: userContext.token,
          }),
      });
    }
  }, [data, page, queryClient]);

  return { uncompliantTemoignages: data, isSuccess, isError, isLoading };
};

export default useFetchUncompliantTemoignages;
