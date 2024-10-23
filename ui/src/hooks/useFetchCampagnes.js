import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { UserContext } from "../context/UserContext";
import { fetchCampagnes } from "../queries/campagnes";

const useFetchCampagnes = ({ query, enabled, page, pageSize = 10 }) => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [`campagnes`, page, query],
    queryFn: () => fetchCampagnes({ query, page, pageSize, token: userContext.token }),
    enabled: !!enabled,
  });

  useEffect(() => {
    if (data?.pagination.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [`campagnes`, page + 1, query],
        queryFn: () => fetchCampagnes({ query, page: page + 1, pageSize, token: userContext.token }),
      });
    }
  }, [data, page, queryClient]);

  return { campagnes: data, isSuccess, isError, isLoading };
};

export default useFetchCampagnes;
