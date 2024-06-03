import { useQuery } from "@tanstack/react-query";
import { fetchTemoignagesDatavisualisationPublic } from "../queries/temoignages";

const useFetchTemoignagesDatavisualisationPublic = ({ intituleFormation }) => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["datavisualisation-public", intituleFormation],
    queryFn: () => fetchTemoignagesDatavisualisationPublic({ intituleFormation }),
  });

  return { datavisualisation: data, isSuccess, isError, isLoading };
};

export default useFetchTemoignagesDatavisualisationPublic;
