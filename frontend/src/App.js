import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./context/context";
import Cookies from "universal-cookie";
import axios from "axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const App = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const cookies = new Cookies();
  let token = cookies.get("token");
  const location = useLocation();

  const getProfile = async () => {
    try {
      let response = await axios.get(`${state.baseUrl}authenticate/${token}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch({
          type: "USER_LOGIN",
          payload: cookies.get("token"),
        });
        dispatch({
          type: "USER_PROFILE",
          payload: response.data,
        });
        return;
      }
      if (response.status === 401) {
        dispatch({
          type: "USER_LOGOUT",
        });
      }
      if (response.status === 404) {
        dispatch({
          type: "USER_LOGOUT",
        });
      }
    } catch (error) {
      if (error.response.status === 404) {
        dispatch({
          type: "USER_LOGOUT",
        });
        return;
      }
      if (error.request.status === 0) {
        dispatch({
          type: "USER_LOGOUT",
        });
        return;
      }
      dispatch({
        type: "USER_LOGOUT",
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, [location]);

  return (
    <>
      <Routes>
        {state.isLogin === false ? (
          <>
            <Route exact path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        ) : null}
        {state.isLogin === true ? (
          <>
            {/* Route For Login User */}
          </>
        ) : null}
      </Routes>
      {state.isLogin === null ? (
        <Box
          sx={{
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            justifyItems: "center",
            flexDirection: "column",
            pl: "50vw",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
    </>
  );
};

export default App;
