import React from "react";
import { useNavigate } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, Box, Typography } from "@mui/material";

import bgImage from "../assets/images/admin-background.jpg";
import LogoutButton from "../components/LogoutButton";

export const customTheme = createTheme({
    typography: {
        fontFamily: "PixGamer"
    }
});

const Admin = () => {
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
                        fontFamily={"PixGamer"}
                        paddingTop={5}
                        fontWeight="bold">
                        Admin Dashboard
                    </Typography>
                    <LogoutButton />
                </Box>

            </ThemeProvider>
        </div>
    )
};

export default Admin;