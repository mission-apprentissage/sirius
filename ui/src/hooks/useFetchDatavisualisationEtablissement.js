import { useQuery } from "@tanstack/react-query";
import { fetchDatavisualisationEtablissement } from "../queries/temoignages";

const useFetchDatavisualisationEtablissement = ({ uai }) => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["datavisualisation-etablissement", uai],
    queryFn: () => fetchDatavisualisationEtablissement({ uai }),
  });

  return { datavisualisation: data, isSuccess, isError, isLoading };
};

export default useFetchDatavisualisationEtablissement;
