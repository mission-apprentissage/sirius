import { useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { fetchVerbatims } from "../queries/verbatims";

const useFetchVerbatims = ({
  etablissementSiret,
  formationId,
  selectedStatus,
  showOnlyDiscrepancies,
  page,
  pageSize = 100,
}) => {
  const queryClient = useQueryClient();

  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [
      "verbatims",
      selectedStatus,
      etablissementSiret,
      formationId,
      showOnlyDiscrepancies,
      page,
    ],
    queryFn: () =>
      fetchVerbatims({
        etablissementSiret,
        formationId,
        selectedStatus,
        page,
        pageSize,
        showOnlyDiscrepancies,
        token: userContext.token,
      }),
  });

  useEffect(() => {
    if (data?.pagination?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [
          `verbatims`,
          selectedStatus,
          etablissementSiret,
          formationId,
          showOnlyDiscrepancies,
          page + 1,
        ],
        queryFn: () =>
          fetchVerbatims({
            etablissementSiret,
            formationId,
            selectedStatus,
            showOnlyDiscrepancies,
            page: page + 1,
            pageSize,
            token: userContext.token,
          }),
      });
    }
  }, [data, page, queryClient]);

  return {
    verbatims: data?.body,
    pagination: data?.pagination,
    isSuccess,
    isError,
    isLoading,
  };
};

export default useFetchVerbatims;
