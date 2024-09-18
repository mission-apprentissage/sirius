import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { fetchTemoignagesXlsExport } from "../queries/temoignages";

const useFetchTemoignagesXlsExport = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isPending } = useMutation({
    mutationFn: (campagneIds) =>
      fetchTemoignagesXlsExport({ campagneIds, token: userContext.token }),
    mutationKey: "temoignagesXlsExport",
  });

  return { mutate, temoignagesXlsExport: data, isSuccess, isError, isPending };
};

export default useFetchTemoignagesXlsExport;
