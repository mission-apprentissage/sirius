import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { fetchRemoteFormations } from "../queries/formations";

const useFetchRemoteFormations = ({ query, enabled, page = 1, pageSize = 1000 }) => {
  const queryClient = useQueryClient();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["formations-remote", page, query],
    queryFn: () => fetchRemoteFormations({ query, page, pageSize }),
    enabled: !!enabled,
  });

  useEffect(() => {
    if (parseInt(data?.pagination.page) < data?.pagination.nombre_de_page) {
      queryClient.prefetchQuery({
        queryKey: ["formations-remote", page + 1, query],
        queryFn: () => fetchRemoteFormations({ query, page: page + 1, pageSize }),
      });
    }
  }, [data, page, queryClient]);

  const orderedFormations = data?.formations.sort((a, b) =>
    a.intituleLong > b.intituleLong ? 1 : b.intituleLong > a.intituleLong ? -1 : 0
  );

  return {
    remoteFormations: orderedFormations,
    remoteFormationsPagination: data?.pagination,
    isSuccess,
    isError,
    isLoading,
  };
};

export default useFetchRemoteFormations;
