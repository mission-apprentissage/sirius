import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchVerbatims = (questionnaireId, etablissementSiret, formationId) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(
          `/api/verbatims?questionnaireId=${questionnaireId}&etablissementSiret=${
            etablissementSiret || ""
          }&formationId=${formationId || ""}`,
          userContext.token
        );
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (questionnaireId) {
      fetchData();
    }
  }, [questionnaireId, etablissementSiret, formationId]);

  return [data, loading, error];
};

export default useFetchVerbatims;
