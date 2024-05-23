import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { deleteTemoignages } from "../queries/temoignages";

const useDeleteTemoignages = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isPending } = useMutation({
    mutationFn: (temoignagesIds) => deleteTemoignages({ temoignagesIds, token: userContext.token }),
    mutationKey: "deleteTemoignages",
  });

  return { mutate, deletedTemoignages: data, isSuccess, isError, isPending };
};

export default useDeleteTemoignages;
