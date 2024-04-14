import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRemoteFormations } from "../queries/campagnes";

const useFetchRemoteFormations = ({ query, enabled, page, pageSize = 1000 }) => {
  const queryClient = useQueryClient();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["formations-remote", page, query],
    queryFn: () => fetchRemoteFormations({ query, page, pageSize }),
    enabled: !!enabled,
  });

  useEffect(() => {
    if (data?.pagination.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["formations-remote", page + 1, query],
        queryFn: () => fetchRemoteFormations({ query, page: page + 1, pageSize }),
      });
    }
  }, [data, page, queryClient]);

  const orderedFormations = data?.formations.sort((a, b) =>
    a.intitule_long > b.intitule_long ? 1 : b.intitule_long > a.intitule_long ? -1 : 0
  );

  return { remoteFormations: orderedFormations, isSuccess, isError, isLoading };
};

export default useFetchRemoteFormations;
