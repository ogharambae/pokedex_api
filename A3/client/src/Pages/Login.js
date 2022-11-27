import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography, Button, Grid, ThemeProvider } from "@mui/material";
import ErrorMessage from "../utility/ErrorMessage";

// Style
import { createTheme } from "@mui/material/styles";
import bgImage from "../assets/images/poke-background.jpg";
import "./Login.css";
import axios from "axios";

export const customTheme = createTheme({
    typography: {
        fontFamily: [
            "Pokemon Solid"
        ]
    }
});

const Login = () => {
    const navigate = useNavigate();

    const loginPageStyle = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        height: "100vh",
        width: "100%",
        top: 0,
        left: 0
    };

    const [credentialError, setCredentialError] = useState(false);

    const [input, setInput] = useState({
        username: "",
        password: ""
    });

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };

    const loginUser = async () => {
        if (!input.username) {
            setCredentialError("Username field is empty.")
        } else if (!input.password) {
            setCredentialError("Password field is empty.")
        } else {
            const API_URL = "http://localhost:5000";
            const { data: resData } = await axios.post(`${API_URL}/login`, input, {
                withCredentials: true
            });
            console.log(resData)
            console.log("msg: " + resData.msg);
            console.log("errorCode: " + resData.errorCode);
            console.log(resData);

            if (!resData.errorCode && resData) {
                setCredentialError(false);
                navigate("/home");
            } else {
                setCredentialError(resData.msg);
            }
        }
    };

    return (
        <div className="Login-component" style={loginPageStyle}>
            <ThemeProvider theme={customTheme}>
                <Box
                    sx={{ mt: 10 }}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems="center"
                    justifyContent="center">
                    <Typography
                        variant="h1"
                        fontFamily={"Pokemon Solid"}
                        paddingTop={5}
                        fontWeight="bold">
                        Pokemon API
                    </Typography>

                    <Typography variant="h5" fontFamily={"Pokemon Solid"}>
                        Welcome to my Pokemon inputbase!
                    </Typography>
                </Box>

                <Box
                    display="flex"
                    flexDirection={"column"}
                    maxWidth={400}
                    borderRadius={2}
                    alignItems="center"
                    justifyContent="center"
                    margin="auto"
                    marginTop={5}
                    padding={3}
                    backgroundColor="rgba(125, 216, 255, 0.8)">
                    <TextField
                        margin="normal"
                        type={"text"}
                        name="username"
                        variant="outlined"
                        placeholder="Username"
                        style={{ width: 300, height: 50 }}
                        value={input.username}
                        onChange={changeHandler}
                    />

                    <TextField
                        margin="normal"
                        name="password"
                        type={"password"}
                        variant="outlined"
                        placeholder="Password"
                        style={{ width: 300, height: 50 }}
                        value={input.password}
                        onChange={changeHandler}
                    />
                    <Button
                        sx={{ marginTop: 3 }}
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit}>
                        Login
                    </Button>
                    <Grid container>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={7} display="flex" alignItems={"center"}>
                            <Typography>Don&apos;t have an account?</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Button
                                onClick={() => {
                                    navigate("/");
                                }}>
                                Sign Up
                            </Button>
                        </Grid>
                        {credentialError && <ErrorMessage msg={credentialError} />}
                    </Grid>
                </Box>
            </ThemeProvider>
        </div>
    );
};

export default Login;
