import { useEffect, useState } from "react";

import { apiGet } from "../utils/api.utils";

const useFetchEtablissementsPublicStatistics = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet("/api/etablissements/public/statistics", {});
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

export default useFetchEtablissementsPublicStatistics;
