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
          `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formations?query={"etablissement_gestionnaire_siret":"${siret}"}&page=1&limit=500`
        );

        // sort by alphabetical order
        const orderedFormations = response.formations.sort((a, b) =>
          a.intitule_long > b.intitule_long ? 1 : b.intitule_long > a.intitule_long ? -1 : 0
        );

        // filter by niveau
        const filteredFormations = orderedFormations.filter(
          (formation) => formation.niveau === "3 (CAP...)" || formation.niveau === "4 (BAC...)"
        );
        setData(filteredFormations);
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
