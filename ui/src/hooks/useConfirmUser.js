import { useEffect, useState } from "react";

import { apiPost } from "../utils/api.utils";

const useConfirmUser = (token) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sendData = async () => {
      try {
        const response = await apiPost("/users/confirm", {
          body: {
            token,
          },
        });

        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (token) {
      sendData();
    }
  }, [token]);

  return [data, loading, error];
};

export default useConfirmUser;
