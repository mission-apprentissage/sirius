import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import useRefreshTokenUser from "../hooks/useRefreshTokenUser";

const UserContext = React.createContext();

const initialState = {
  loading: true,
  token: null,
  user: null,
};

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const { refreshTokenUser } = useRefreshTokenUser();

  const verifyUser = async () => {
    refreshTokenUser(
      {},
      {
        onSuccess: (result) => {
          const decodedToken = jwt_decode(result.token);
          setState({
            loading: false,
            token: result.token,
            user: decodedToken.user,
          });
        },
        onError: () => {
          setState({ ...initialState, loading: false });
        },
      }
    );
  };

  useEffect(() => {
    if (!state.token) {
      verifyUser();
    } else {
      const intervalId = setInterval(verifyUser, 1000 * 60 * 14);

      return () => clearInterval(intervalId);
    }
  }, [state.token]);

  return <UserContext.Provider value={[state, setState]}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
