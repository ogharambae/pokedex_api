import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";
import axios from "axios";

import "./Login.css";
import ValidateRegister from "../utility/ValidateRegister";
import SuccessDialog from "../components/SuccessDialog";
import bgImage from "../assets/images/poke-background.jpg";

export const customTheme = createTheme({
    typography: {
        fontFamily: "Pokemon Solid"
    }
});

const Signup = () => {
    const navigate = useNavigate();

    const loginPageStyle = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        height: "100vh",
        width: "100%",
        top: 0,
        left: 0,
        overflow: "scroll",
        paddingBottom: "5%"
    };

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [isValid, setValid] = useState(false);
    const [response, setResponse] = useState(false);

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(ValidateRegister(input));

        if (!Object.entries(ValidateRegister(input)).length) {
            const API_URL = "http://localhost:5000";
            const { resData } = axios.post(`${API_URL}/register`, input, {
                withCredentials: true
            });

            console.log(resData)
            console.log("msg: " + resData.msg);
            console.log("errorCode: " + resData.errorCode);
            console.log(resData);

            if (!resData.errorCode && resData) {
                setValid(true);
            } else {
                setResponse(true);
                setValid(true);
            }
            setValid(false);
            setResponse(false);
        }
    };

    useEffect(() => { }, [
        input.email,
        input.username,
        input.password,
        input.confirmPassword
    ]);

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
                        paddingTop={5}
                        fontWeight="bold">
                        Pokemon API Signup
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
                        name="email"
                        variant="outlined"
                        placeholder="First name"
                        style={{ width: 300, height: 40 }}
                        value={input.email}
                        onChange={changeHandler}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

                    <TextField
                        margin="normal"
                        type={"text"}
                        name="username"
                        variant="outlined"
                        placeholder="Username"
                        style={{ width: 300, height: 40 }}
                        value={input.username}
                        onChange={changeHandler}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}

                    <TextField
                        margin="normal"
                        name="password"
                        type={"password"}
                        variant="outlined"
                        placeholder="Password"
                        style={{ width: 300, height: 40 }}
                        value={input.password}
                        onChange={changeHandler}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}

                    <TextField
                        margin="normal"
                        name="confirmPassword"
                        type={"password"}
                        variant="outlined"
                        placeholder="Confirm Password"
                        style={{ width: 300, height: 40 }}
                        value={input.confirmPassword}
                        onChange={changeHandler}
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

                    <Button
                        sx={{ marginTop: 3 }}
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit}>
                        Signup
                    </Button>

                    <Grid container>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={7} pt={1}>
                            <Typography>Already have an account?</Typography>
                        </Grid>

                        <Grid item xs={3} pt={1}>
                            <Button
                                onClick={() => {
                                    navigate("/login");
                                }}>
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {isValid && <SuccessDialog isDuplicate={response} />}
            </ThemeProvider>
        </div>
    );
};
export default Signup;
