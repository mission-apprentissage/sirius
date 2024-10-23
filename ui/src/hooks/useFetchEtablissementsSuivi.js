import { useContext, useEffect, useState } from "react";

import { UserContext } from "../context/UserContext";
import { apiGet } from "../utils/api.utils";

const useFetchEtablissementsSuivi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGet(`/api/etablissements/suivi`, {
          headers: {
            Authorization: `Bearer ${userContext.token}`,
          },
        });
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

export default useFetchEtablissementsSuivi;
