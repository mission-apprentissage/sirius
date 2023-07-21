import { useEffect, useState } from "react";
import { _get } from "../utils/httpClient";

const useFetchRemoteEtablissement = (siret) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(
          `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${siret}"}&page=1&limit=1`
        );
        setData(response.etablissements[0]);
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

export default useFetchRemoteEtablissement;
