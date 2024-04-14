import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { fetchAlreadyExistingFormations } from "../queries/campagnes";

const useFetchAlreadyExistingFormations = ({ campagneIds, enabled }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["formations-local-id", campagneIds],
    queryFn: () => fetchAlreadyExistingFormations({ campagneIds, token: userContext.token }),
    enabled: !!enabled,
  });

  return { existingFormationIds: data, isSuccess, isError, isLoading };
};

export default useFetchAlreadyExistingFormations;
