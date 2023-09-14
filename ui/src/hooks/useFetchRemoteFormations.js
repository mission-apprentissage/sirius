import { useEffect, useState } from "react";
import { _get } from "../utils/httpClient";

const useFetchRemoteFormations = (siret) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(
          `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formations?query={"$or":[{"etablissement_formateur_siret":${siret}},{"etablissement_gestionnaire_siret":${siret}}], "published": "true", "catalogue_published": "true", "niveau":["3 (CAP...)","4 (BAC...)"]}&page=1&limit=500`
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
    if (siret) {
      fetchData();
    }
  }, [siret]);

  return [data, loading, error];
};

export default useFetchRemoteFormations;
