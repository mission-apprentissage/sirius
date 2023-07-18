import React, { useState, useEffect, useCallback } from "react";
import jwt from "jwt-decode";
import { _post } from "../utils/httpClient";

const UserContext = React.createContext([{}, () => {}]);

let initialState = { loading: true, token: null };

const UserProvider = (props) => {
  const [user, setUser] = useState(initialState);

  const verifyUser = useCallback(async () => {
    const result = await _post(`/api/users/refreshToken`);
    if (result.success) {
      const decodedToken = jwt(result.token);
      setUser((oldValues) => {
        return {
          ...oldValues,
          token: result.token,
          loading: false,
          currentUserId: decodedToken._id,
        };
      });
    } else {
      setUser((oldValues) => {
        return { ...oldValues, token: null, loading: false };
      });
    }
    setTimeout(verifyUser, 60 * 5 * 1000);
  }, [setUser]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  return <UserContext.Provider value={[user, setUser]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
