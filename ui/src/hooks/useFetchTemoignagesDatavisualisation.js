import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchTemoignagesDatavisualisation } from "../queries/temoignages";
import { useMutation } from "@tanstack/react-query";

const useFetchTemoignagesDatavisualisation = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (campagneIds) =>
      fetchTemoignagesDatavisualisation({ campagneIds, token: userContext.token }),
  });

  return { mutate, datavisualisation: data, isSuccess, isError, isLoading };
};

export default useFetchTemoignagesDatavisualisation;
