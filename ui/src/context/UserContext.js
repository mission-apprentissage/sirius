import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import useRefreshTokenUser from "../hooks/useRefreshTokenUser";
import useFetchMe from "../hooks/useFetchMe";
import { USER_ROLES } from "../constants";
import { _get } from "../utils/httpClient";

const UserContext = React.createContext();

const initialState = {
  loading: true,
  token: null,
  user: null,
};

const UserProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const { refreshTokenUser } = useRefreshTokenUser();

  const shouldHaveEtablissements =
    state.user?.role === USER_ROLES.ETABLISSEMENT && !state.user?.etablissements?.length;

  const shouldHaveScope = state.user?.role === USER_ROLES.OBSERVER && !state.user?.scope;

  const { me } = useFetchMe({
    enabled: !!state?.token && (shouldHaveEtablissements || shouldHaveScope),
    token: state?.token,
  });

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
    if (state.token && !state.user) {
      const forceLogout = async () => {
        const result = await _get(`/api/users/logout`, state.token);
        if (result.success) {
          setState({ ...initialState, loading: false });
        }
      };

      forceLogout();
    }
  }, [state.token, state.user]);

  useEffect(() => {
    if (!state.token) {
      verifyUser();
    } else {
      const intervalId = setInterval(verifyUser, 1000 * 60 * 14);
      return () => clearInterval(intervalId);
    }
  }, [state.token]);

  useEffect(() => {
    if (me && shouldHaveEtablissements) {
      setState((prevState) => ({
        ...prevState,
        user: { ...prevState.user, etablissements: me?.etablissements },
      }));
    }
    if (me && shouldHaveScope) {
      setState((prevState) => ({
        ...prevState,
        user: { ...prevState.user, scope: me?.scope },
      }));
    }
  }, [me, shouldHaveEtablissements, shouldHaveScope]);

  return <UserContext.Provider value={[state, setState]}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
