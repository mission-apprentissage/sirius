import { useEffect, useState } from "react";
import { _get } from "../utils/httpClient";

const useFetchRemoteFormations = (userSiret) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = userSiret
          .map((siret) => [
            { etablissement_formateur_siret: siret },
            { etablissement_gestionnaire_siret: siret },
          ])
          .flat();

        const response = await _get(
          `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formations?query={"$or": ${JSON.stringify(
            query
          )}, "published": "true", "catalogue_published": "true", "niveau":["3 (CAP...)","4 (BAC...)"]}&page=1&limit=500`
        );

        // sort by alphabetical order
        const orderedFormations = response.formations.sort((a, b) =>
          a.intitule_long > b.intitule_long ? 1 : b.intitule_long > a.intitule_long ? -1 : 0
        );

        setData(orderedFormations);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (userSiret?.length > 0) {
      fetchData();
    }
  }, []);

  return [data, loading, error];
};

export default useFetchRemoteFormations;
