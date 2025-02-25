import { useQueries } from "@tanstack/react-query";
import { useContext } from "react";

import { splitIntoBatches } from "../campagnes/utils";
import { UserContext } from "../context/UserContext";
import { fetchCampagnes } from "../queries/campagnes";

const useFetchCampagnesByBatch = ({ campagneIds, enabled }) => {
  const [userContext] = useContext(UserContext);

  const batches = splitIntoBatches(campagneIds, 50);

  const queryResults = useQueries({
    queries: batches.map((batch, index) => ({
      queryKey: ["campagnes-batches", index, campagneIds],
      queryFn: () =>
        fetchCampagnes({
          campagneIds,
          pageSize: batch.length,
          page: index + 1,
          token: userContext.token,
        }),
      enabled: !!enabled,
    })),
  });

  const campagnes = queryResults?.map((queryResult) => queryResult?.data?.body).flat() || [];
  const isSuccess = queryResults?.every((queryResult) => queryResult.isSuccess) || false;
  const isError = queryResults?.some((queryResult) => queryResult.isError) || false;
  const isLoading = queryResults?.some((queryResult) => queryResult.isLoading) || false;

  return {
    campagnes,
    isSuccess,
    isError,
    isLoading,
  };
};

export default useFetchCampagnesByBatch;
