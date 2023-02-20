import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

// Projects Commponents Imports
import { signUpSchema } from "./Schema";
import Alert from "../../components/Alert";

import { GlobalContext } from "../../context/context";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

// Material UI Commponents Imports

import InputAdornment from "@mui/material/InputAdornment";
import Cookies from "universal-cookie";

// Material Icons Imports

import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonOffIcon from "@mui/icons-material/PersonOff";

export default function SignUp() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [cpasswordShown, setCpasswordShown] = useState(false);
  const [alert, setAlert] = useState(false);
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");
  const [userError, setUserError] = useState(false);
  const [open, setOpen] = useState(false);

  let { state , dispatch } = useContext(GlobalContext);

  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  // Confirm Password toggle handler
  const toggleCpassword = () => {
    setCpasswordShown(!cpasswordShown);
  };
  let navigate = new useNavigate();
  const initialValues = {
    fullName: "",
    userName: "",
    email: "",
    password: "",
    cpassword: "",
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      onSubmit: async (values, action) => {
        try {
          let response = await axios.post(
            `${state.baseUrl}/users/user-registeration/`,
            {
              fullname: values.fullName,
              username: values.userName,
              email: values.email,
              password: values.password,
            },
            {
              withCredentials: true,
            }
          )
          if (response.status === 200) {
            setAlert(true);
            setMsg(
              "Your Registeration Is Successfull Please Wait For Verifivation ."
            );
            setType("success");
            action.resetForm();
            try {
              let loginresponse = await axios.post(
                `${state.baseUrl}/authenticate/access-token-json/`,
                {
                  username: values.userName,
                  password: values.password,
                },
                {
                  withCredentials: true,
                }
              );
    
              if (loginresponse.status === 200) {
                setAlert(true);
                setMsg("You Are Successfully Logged In");
                setType("success");
                const cookies = new Cookies();
                cookies.set("token", loginresponse.data.access_token, { path: "*" });
                let token = cookies.get("token");
                let res = await axios.get(`${state.baseUrl}/authenticate/${token}/`, {
                  withCredentials: true,
                });
                if (res.status === 200) {
                  dispatch({
                    type: "USER_LOGIN",
                    payload: cookies.get("token"),
                  });
                  navigate("/");
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
                setMsg(loginresponse.data.detail);
                setType("error");
                return;
              }
            } catch (error) {
              if (error.request.status === 0) {
                setAlert(false);
                action.resetForm();
              }
              if (error.loginresponse?.status === 403) {
                setAlert(true);
                setMsg(error.loginresponse?.data.detail);
                setType("error");
              }
              if (error.loginresponse?.status === 404) {
                setAlert(true);
                setMsg(error.loginresponse?.data.detail);
                setType("error");
              }
            }

          } else {
            setAlert(true);
            setMsg("Some Thing Went Wrong , Please Try Again Later.");
            setType("error");
          }
        } catch (error) {
          if (error.request.status === 0) {
            setAlert(false);
          }
          if (error.response.status === 400) {
            setAlert(true);
            setMsg(error.response.data.detail);
            console.log(error);
            // setMsg(
            //   "This Username Is Alrady In Use Try With Another Username . "
            // );
            setType("error");
          }
          if (error.response.status === 409) {
            setAlert(true);
            setMsg(error.response.data.detail);
            console.log(error);
            setType("error");
          }
        }
      },
    });

  const checkAvailabilty = async (e)  => {
    try {
      let response = await axios.get(`${state.baseUrl}/users/is_available/${e}`);
      if (response.status === 200) {
        setUserError(false);
      }
    } catch (error) {
      if (error.response.status === 409) {
        setUserError("username already exist");
      }
    }
  };

  return (
    <>
      {alert ? (
        <Alert msg={msg} type={type} setAlert={setAlert} open={open} />
      ) : (
        ""
      )}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" mt="10vh" variant="h5">
            Sign up
          </Typography>
          <form style={{ marginTop: "25px" }} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{
                    width: "100%",
                    marginBottom: "2vh",
                  }}
                  name="fullName"
                  type="text"
                  label="Full Name"
                  id="fullName"
                  className="my-text-field"
                  onBlur={(e) => {
                    handleBlur(e);
                  }}
                  value={values.fullName}
                  onChange={handleChange}
                  error={touched.fullName && Boolean(errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                  InputLabelProps={{
                    sx: {
                      fontSize: { xs: "11px", xl: "13px" },
                      paddingTop: { xs: "3.3px", xl: "1px" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: { xs: "1.9vh", xl: "2vh" },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon
                          sx={{
                            fontSize: { xs: "small", xl: "large" },
                            opacity: "0.9",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{
                    // width: { xs: "65%", xl: "45%" },
                    width: "100%",
                    marginBottom: "2vh",
                  }}
                  name="userName"
                  type="text"
                  label="User Name"
                  id="userName"
                  className="my-text-field"
                  onBlur={(e) => {
                    handleBlur(e);
                    checkAvailabilty(e.target.value); // width: { xs: "65%", xl: "45%" },
                  }}
                  value={values.userName}
                  onChange={handleChange}
                  error={
                    (touched.userName && Boolean(errors.userName)) || userError
                  }
                  helperText={
                    (touched.userName && errors.userName) || userError
                  }
                  InputLabelProps={{
                    sx: {
                      fontSize: { xs: "11px", xl: "13px" },
                      paddingTop: { xs: "3.3px", xl: "1px" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: { xs: "1.9vh", xl: "2vh" },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        {userError ? (
                          <PersonOffIcon
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              opacity: "0.9",
                            }}
                          />
                        ) : (
                          <PersonIcon
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              opacity: "0.9",
                            }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{
                    // width: { xs: "65%", xl: "100%" },
                    width: "100%",
                    marginBottom: "2vh",
                  }}
                  name="email"
                  type="email"
                  label="Email"
                  id="email"
                  className="my-text-field"
                  onBlur={handleBlur}
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  InputLabelProps={{
                    sx: {
                      fontSize: { xs: "11px", xl: "13px" },
                      paddingTop: { xs: "3.3px", xl: "1px" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: { xs: "1.9vh", xl: "2vh" },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <MailIcon
                          sx={{
                            fontSize: { xs: "small", xl: "large" },
                            opacity: "0.9",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{
                    // width: { xs: "65%", xl: "45%" },
                    width: "100%",
                    marginBottom: "2vh",
                  }}
                  name="password"
                  type={passwordShown ? "text" : "password"}
                  label="Password"
                  id="password"
                  autoComplete="off"
                  className="my-text-field"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputLabelProps={{
                    sx: {
                      fontSize: { xs: "11px", xl: "12px" },
                      paddingTop: { xs: "3.3px", xl: "2px" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: { xs: "1.9vh", xl: "2vh" },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        {!errors.password && values.password ? (
                          <SecurityIcon
                            onClick={togglePassword}
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              color: "green",
                              opacity: "0.9",
                            }}
                          />
                        ) : !passwordShown ? (
                          <VisibilityOffIcon
                            onClick={togglePassword}
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              opacity: "0.9",
                            }}
                          />
                        ) : (
                          <VisibilityIcon
                            onClick={togglePassword}
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              opacity: "0.9",
                            }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{
                    width: "100%",
                    // width: { xs: "65%", xl: "45%" },
                  }}
                  name="cpassword"
                  type={cpasswordShown ? "text" : "password"}
                  label="Confirm Password"
                  autoComplete="off"
                  id="cpassword"
                  onBlur={handleBlur}
                  value={values.cpassword}
                  onChange={handleChange}
                  className="my-text-field"
                  error={touched.cpassword && Boolean(errors.cpassword)}
                  helperText={touched.cpassword && errors.cpassword}
                  InputLabelProps={{
                    sx: {
                      fontSize: { xs: "11px", xl: "12px" },
                      paddingTop: { xs: "3.3px", xl: "2px" },
                    },
                  }}
                  InputProps={{
                    sx: {
                      fontSize: { xs: "1.9vh", xl: "2vh" },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        {!errors.cpassword && values.cpassword ? (
                          <CheckCircleIcon
                            onClick={toggleCpassword}
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              color: "green",
                              opacity: "0.9",
                            }}
                          />
                        ) : !cpasswordShown ? (
                          <VisibilityOffIcon
                            onClick={toggleCpassword}
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              opacity: "0.9",
                            }}
                          />
                        ) : (
                          <VisibilityIcon
                            onClick={toggleCpassword}
                            sx={{
                              fontSize: { xs: "small", xl: "large" },
                              opacity: "0.9",
                            }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{
                // width: { xs: "65%", xl: "45%" },
                width: "100%",
                marginTop: "3vh",
                marginBottom: "1vh",
                borderRadius: "5px",
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => {
                setOpen(true);
              }}
              // disabled={
              //   !values.email ||
              //   !values.fullName ||
              //   !values.userName ||
              //   errors.password ||
              //   errors.cpassword
              // }
            >
              Create Account
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
              </Typography>
            
            
        
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
            Already Have An Account ?
            <Link
              to="/"
              style={{ textDecoration: "underline", color: "black" }}
            >
                {"\u00A0"}Login
            </Link>
          </Typography>
        </Box>
        </Box>
      </Container>
    </>
  );
}
