import { useEffect, useState } from "react";
import { _get } from "../utils/httpClient";

const useFetchEtablissementsPublicSuivi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(`/api/etablissements/public/suivi`);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return [data, loading, error];
};

export default useFetchEtablissementsPublicSuivi;
