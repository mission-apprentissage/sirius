import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchTemoignagesDatavisualisation } from "../queries/temoignages";
import { useMutation } from "@tanstack/react-query";

const useFetchTemoignagesDatavisualisation = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isIdle, isPending } = useMutation({
    mutationFn: (campagneIds) =>
      fetchTemoignagesDatavisualisation({ campagneIds, token: userContext.token }),
    mutationKey: "fetchTemoignagesDatavisualisation",
  });

  return {
    mutate,
    datavisualisation: data,
    isSuccess,
    isError,
    isLoading: isPending || isIdle,
    isIdle,
  };
};

export default useFetchTemoignagesDatavisualisation;
