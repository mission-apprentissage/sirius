import { useQuery } from "@tanstack/react-query";

import { fetchDatavisualisationFormation } from "../queries/temoignages";

const useFetchDatavisualisationFormation = ({ intituleFormation, cfd, idCertifinfo, slug }) => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    enabled: !!intituleFormation || !!cfd || !!idCertifinfo || !!slug,
    queryKey: ["datavisualisation-formation", intituleFormation, cfd, idCertifinfo, slug],
    queryFn: () => fetchDatavisualisationFormation({ intituleFormation, cfd, idCertifinfo, slug }),
  });

  return { datavisualisation: data, isSuccess, isError, isLoading };
};

export default useFetchDatavisualisationFormation;
