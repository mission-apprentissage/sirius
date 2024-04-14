import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchCampagnesSorted } from "../queries/campagnes";
import { useQuery } from "@tanstack/react-query";

const useFetchCampagnesSorted = (type) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [`campagnesSorted-${type}`],
    queryFn: () => fetchCampagnesSorted({ type, token: userContext.token }),
    enabled: !!type,
  });

  return { campagnesSorted: data, isSuccess, isError, isLoading };
};

export default useFetchCampagnesSorted;
