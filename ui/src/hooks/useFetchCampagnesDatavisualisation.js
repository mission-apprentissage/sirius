import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchCampagnesDatavisualisation } from "../queries/campagnes";
import { useMutation } from "@tanstack/react-query";

const useFetchCampagnesDatavisualisation = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (campagneIds) =>
      fetchCampagnesDatavisualisation({ campagneIds, token: userContext.token }),
  });

  return { mutate, datavisualisation: data, isSuccess, isError, isLoading };
};

export default useFetchCampagnesDatavisualisation;
