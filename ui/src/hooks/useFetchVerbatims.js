import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchVerbatims = (questionnaireIds, etablissementSiret, formationId) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        questionnaireIds.forEach(async (questionnaireId) => {
          const response = await _get(
            `/api/verbatims?questionnaireId=${questionnaireId}&etablissementSiret=${
              etablissementSiret || ""
            }&formationId=${formationId || ""}`,
            userContext.token
          );
          if (response.length) {
            if (!data) {
              setData(response);
            } else {
              setData(data.concat(response));
            }
          }
          setLoading(false);
        });
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (questionnaireIds.length) {
      fetchData();
    }
  }, [questionnaireIds, etablissementSiret, formationId]);

  return [data, loading, error];
};

export default useFetchVerbatims;
