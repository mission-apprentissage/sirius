import React, { useState, useEffect } from "react";
import jwt from "jwt-decode";
import { _post } from "../utils/httpClient";

const UserContext = React.createContext([{}, () => {}]);

let initialState = { loading: true, token: null };

const UserProvider = (props) => {
  const [user, setUser] = useState(initialState);

  const verifyUser = async () => {
    const result = await _post(`/api/users/refreshToken`);
    if (result.success) {
      const decodedToken = jwt(result.token);
      setUser((oldValues) => {
        return {
          ...oldValues,
          token: result.token,
          loading: false,
          currentUserId: decodedToken._id,
          currentUserRole: decodedToken.role,
          currentUserStatus: decodedToken.status,
          siret: decodedToken.siret,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
          etablissementLabel: decodedToken.etablissementLabel,
          etablissements: decodedToken.etablissements,
          acceptedCgu: decodedToken.acceptedCgu || false,
        };
      });
    } else {
      setUser((oldValues) => {
        return { ...oldValues, token: null, loading: false };
      });
    }
    setTimeout(verifyUser, 60 * 5 * 1000);
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return <UserContext.Provider value={[user, setUser]}>{props.children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
