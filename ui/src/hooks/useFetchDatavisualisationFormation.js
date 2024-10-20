import { useQuery } from "@tanstack/react-query";

import { fetchDatavisualisationFormation } from "../queries/temoignages";

const useFetchDatavisualisationFormation = ({ intituleFormation }) => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    enabled: !!intituleFormation,
    queryKey: ["datavisualisation-formation", intituleFormation],
    queryFn: () => fetchDatavisualisationFormation({ intituleFormation }),
  });

  return { datavisualisation: data, isSuccess, isError, isLoading };
};

export default useFetchDatavisualisationFormation;
