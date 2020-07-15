import { useState, useCallback, useEffect } from "react";
import { _get } from "../../utils/httpClient";

export function useGet(url) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await _get(url);
      setResponse(response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    async function run() {
      return sendRequest();
    }
    run();
  }, [url, sendRequest]);

  return [response, loading, error];
}
