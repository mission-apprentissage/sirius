import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchCampagnesStatistics } from "../queries/campagnes";
import { useMutation } from "@tanstack/react-query";

const useFetchCampagnesStatistics = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (campagneIds) =>
      fetchCampagnesStatistics({ campagneIds, token: userContext.token }),
  });

  return { mutate, statistics: data, isSuccess, isError, isLoading };
};

export default useFetchCampagnesStatistics;
