import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// React Imports

import { useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../context/context";

// Projects Commponents Imports

import Alert from "../../components/Alert";

// 3rd Party Imports

import Cookies from "universal-cookie";
import axios from "axios";
import { useFormik } from "formik";

// Material UI Commponents Imports

import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

// Material Icons Imports

import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SignUp() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [alert, setAlert] = useState(false);
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [savePass, setSavePass] = useState(false);

  // Set Cookies

  const cookies = new Cookies();
  const currentUname = cookies.get("uname");
  const currentPwd = cookies.get("pwd");

  // Context Variable

  let { state, dispatch } = useContext(GlobalContext);
console.log(state)
  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const initialValues = {
    userName: currentUname ? currentUname : "",
    password: currentPwd ? currentPwd : "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: async (values, action) => {
        // Save Password Funtion

        if (savePass) {
          cookies.set("uname", values.userName, { path: "/" });
          cookies.set("pwd", values.password, { path: "/" });
        }

        try {
          let response = await axios.post(
            `${state.baseUrl}/authenticate/access-token-json/`,
            {
              username: values.userName,
              password: values.password,
            },
            {
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            setAlert(true);
            setMsg("You Are Successfully Logged In");
            setType("success");
            const cookies = new Cookies();
            cookies.set("token", response.data.access_token, { path: "*" });
            let token = cookies.get("token");
            let res = await axios.get(`${state.baseUrl}/authenticate/${token}/`, {
              withCredentials: true,
            });
            if (res.status === 200) {
              dispatch({
                type: "USER_LOGIN",
                payload: cookies.get("token"),
              });
              dispatch({
                type: "USER_PROFILE",
                payload: res.data,
              });
              return;
            }
            if (res.status === 401) {
              dispatch({
                type: "USER_LOGOUT",
              });
            }

            action.resetForm();
          } else {
            setAlert(true);
            setMsg(response.data.detail);
            setType("error");
            return;
          }
        } catch (error) {
          if (error.request.status === 0) {
            setAlert(false);
            action.resetForm();
          }
          if (error.response?.status === 403) {
            setAlert(true);
            setMsg(error.response?.data.detail);
            setType("error");
          }
          if (error.response?.status === 404) {
            setAlert(true);
            setMsg(error.response?.data.detail);
            setType("error");
          }
        }
      },
    });

  return (
    <>
      {alert ? (
        <Alert msg={msg} type={type} setAlert={setAlert} open={open} />
      ) : (
        ""
      )}
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" mt="10vh" variant="h5">
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                  marginBottom: "2vh",
                }}
                name="userName"
                type="text"
                label="User Name"
                id="userName"
                onBlur={handleBlur}
                value={values.userName}
                onChange={handleChange}
                error={touched.userName && Boolean(errors.userName)}
                helperText={touched.userName && errors.userName}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon sx={{ fontSize: "large", opacity: "0.9" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  width: "100%",
                }}
                name="password"
                type={passwordShown ? "text" : "password"}
                label="Password"
                id="password"
                onBlur={handleBlur}
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: !passwordShown ? (
                    <VisibilityOffIcon
                      onClick={togglePassword}
                      sx={{ fontSize: "large", opacity: "0.9" }}
                    />
                  ) : (
                    <VisibilityIcon
                      onClick={togglePassword}
                      sx={{ fontSize: "large", opacity: "0.9" }}
                    />
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => setOpen(true)}
          >
            Login
          </Button>
        </form>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: { xs: "60vw", md: "48vw", lg: "38vw", xl: "27vw" },
          }}
        >
          <FormControlLabel
            sx={{
              color: "gray",
            }}
            label={
              <Typography
                color="textSecondary"
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "13px",
                    lg: "15px",
                    //     xl: "2vh",
                  },
                }}
              >
                Save{"\u00A0"}Passowrd
              </Typography>
            }
            control={
              <Checkbox
                size="small"
                onChange={(e) => {
                  setSavePass(e.target.checked);
                }}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "1.3vh", lg: "2vh", xl: "2.6vh" },
                  },
                }}
              />
            }
          />
          <Typography
            sx={{
              color: "gray",
              fontSize: {
                xs: "10px",
                sm: "13px",
                lg: "15px",
                // xl: "2vh",
              },
              display: "inline",
            }}
            variant="p"
          >
            <Link
              to="/signup"
              style={{ textDecoration: "underline", color: "black" }}
            >
              {/* <b style={{ color: "black", opacity: "0.9" }}> */}
                {" "}
                Create{"\u00A0"}Account
              {/* </b> */}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
    </>
  );
}
