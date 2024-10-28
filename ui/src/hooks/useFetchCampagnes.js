import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { UserContext } from "../context/UserContext";
import { fetchCampagnes } from "../queries/campagnes";

const useFetchCampagnes = ({ search, diplome, siret, enabled, page, pageSize = 10 }) => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, error, isLoading } = useQuery({
    queryKey: [`campagnes`, page, search, diplome, siret],
    queryFn: () => fetchCampagnes({ search, diplome, siret, page, pageSize, token: userContext.token }),
    enabled: !!enabled,
  });

  useEffect(() => {
    if (data?.pagination.hasMore) {
      queryClient.prefetchQuery({
        queryKey: [`campagnes`, page + 1, search, diplome, siret],
        queryFn: () =>
          fetchCampagnes({
            search,
            diplome,
            siret,
            page: page + 1,
            pageSize,
            token: userContext.token,
          }),
      });
    }
  }, [data, page, queryClient]);

  return {
    campagnes: data?.body,
    campagnesPagination: data?.pagination,
    campagnesIds: data?.ids,
    isSuccess,
    isError,
    isLoading,
  };
};

export default useFetchCampagnes;
