import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import ContextProvider from "./context/context";
const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 320,
      md: 425,
      lg: 768,
      xl: 1024,
      xxl : 1390
    },
  },
});
root.render(
  <React.StrictMode>
    <ContextProvider>
    <Router>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
    </Router>
    </ContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
