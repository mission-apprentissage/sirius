import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchCampagnesStatistics } from "../queries/campagnes";

const useFetchCampagnesStatistics = () => {
  const [userContext] = useContext(UserContext);
  const { mutate, data, isSuccess, isError, isPending, isIdle } = useMutation({
    mutationFn: (campagneIds) => fetchCampagnesStatistics({ campagneIds, token: userContext.token }),
    mutationKey: "fetchCampagnesStatistics",
  });

  return { mutate, statistics: data, isSuccess, isError, isLoading: isPending || isIdle };
};

export default useFetchCampagnesStatistics;
