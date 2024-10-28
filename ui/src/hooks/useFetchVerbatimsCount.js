import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchVerbatimsCount } from "../queries/verbatims";

const useFetchVerbatimsCount = ({ etablissementSiret, formationId }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["verbatims-count", etablissementSiret, formationId],
    queryFn: () =>
      fetchVerbatimsCount({
        etablissementSiret,
        formationId,
        token: userContext.token,
      }),
  });

  return {
    verbatimsCount: data,
    isSuccess,
    isError,
    isLoading,
  };
};

export default useFetchVerbatimsCount;
