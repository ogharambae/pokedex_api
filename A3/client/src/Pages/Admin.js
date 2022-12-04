import React, { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, Box, Typography, Grid } from "@mui/material";
import axios from "axios";

import filterData from "../utility/FilterApiData";
import bgImage from "../assets/images/admin-background.jpg";
import LogoutButton from "../components/LogoutButton";
import UniqueApiUserChart from "../components/UniqueApiUserChart";
import TopApiUserChart from "../components/TopApiUserChart";
import Table from "../components/TopEndpointUserTable";

export const customTheme = createTheme({
    typography: {
        fontFamily: "PixGamer"
    }
});

const Admin = () => {
    const loginPageStyle = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "fixed",
        height: "100vh",
        width: "100%",
        overflow: "scroll",
        top: 0,
        left: 0
    };

    const [uniqueApiUsersData, setUniqueApiUsersData] = useState([]);
    const [topApiUsersData, setTopApiUsersData] = useState([]);
    const [topUserEachEndpointData, setTopUserEachEndpointData] = useState([]);
    const [errorsByEndpointData, setErrorsByEndpointData] = useState([]);
    const [recentErrorsData, setRecentErrorsData] = useState([]);

    const getApiData = async () => {
        const API_URL = "http://localhost:8000"
        await axios.get(`${API_URL}/userApi`, {
            withCredentials: true
        }).then((response) => {
            const { uniqueApiUsers, topApiUsers, topUserEachEndpoint, errorsByEndpoint, recentErrors } = filterData(response);
            setUniqueApiUsersData(uniqueApiUsers)
            setTopApiUsersData(topApiUsers)
            setTopUserEachEndpointData(topUserEachEndpoint)
            setErrorsByEndpointData(errorsByEndpoint)
            setRecentErrorsData(recentErrors)
        })
    }

    useEffect(() => {
        getApiData();
    }, [])

    return (
        <div className="Login-component" style={loginPageStyle}>
            <ThemeProvider theme={customTheme}>
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            height: "auto",
                            mt: 2
                        }}>
                        <Typography
                            variant="h1"
                            fontFamily={"PixGamer"}
                            paddingTop={5}
                            fontWeight="bold">
                            Admin Dashboard
                        </Typography>
                    </Box>

                    <Box
                        direction="row"
                        marginTop={2}
                    >
                        <Grid
                            container
                            rowSpacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            padding={2}>
                            <Grid
                                item
                                xs={6}>
                                <UniqueApiUserChart data={uniqueApiUsersData} />
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <TopApiUserChart data={topApiUsersData} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box
                        direction="row"
                        marginTop={2}>
                        <Grid
                            container
                            rowSpacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            padding={2}>
                            <Grid
                                item
                                xs={6}>
                                <Typography
                                    textAlign="center"
                                    variant="h4"
                                    paddingBottom={1}>
                                    Top Users For Each Endpoint
                                </Typography>
                                <Table data={topUserEachEndpointData} />
                            </Grid>
                            {/* <Grid
                                item
                                xs={6}>
                                <Table />
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <Table />
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <Table />
                            </Grid> */}
                        </Grid>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            height: "auto",
                            mt: 2,
                            mb: 2
                        }}>
                        <LogoutButton />
                    </Box>

                </Box>
            </ThemeProvider>
        </div>
    )
};

export default Admin;