import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchCampagnesSorted } from "../queries/campagnes";
import { useQuery } from "@tanstack/react-query";
import { campagnesDisplayMode } from "../constants";

const useFetchCampagnesSorted = (type) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [`campagnesSorted-${type}`],
    queryFn: () => fetchCampagnesSorted({ type, token: userContext.token }),
    enabled: type === campagnesDisplayMode[0].value || type === campagnesDisplayMode[1].value,
  });

  return { campagnesSorted: data, isSuccess, isError, isLoading };
};

export default useFetchCampagnesSorted;
