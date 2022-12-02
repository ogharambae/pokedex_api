import React, { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, Box, Typography, Grid } from "@mui/material";
import axios from "axios";

import filterData from "../utility/FilterApiData";
import bgImage from "../assets/images/admin-background.jpg";
import LogoutButton from "../components/LogoutButton";
import BarChart from "../components/BarChart";
import { MockData } from "../utility/MockData"
import Table from "../components/Table"

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
        top: 0,
        left: 0
    };

    const [userApiData, setUserApiData] = useState({});
    const [userEndpointData, setUserEndpointData] = useState({});
    const [accessRouteLogs, setAccessRouteLogs] = useState({});

    const [chartData, setChartData] = useState({
        labels: MockData.map((data) => data.year),
        datasets: [{
            label: "xData",
            data: MockData.map((data) => data.xData),
            backgroundColor: ["green", "blue"]
        }]
    });

    const getApiData = async () => {
        const API_URL = "http://localhost:8000"
        await axios.get(`${API_URL}/userApi`, {
            withCredentials: true
        }).then((response) => {
            setUserApiData(response.data.userApiData);
            setUserEndpointData(response.data.userEndpointData);
            setAccessRouteLogs(response.data.accessRouteLogs);
            console.log(response.data.userApiData)
            console.log(response.data.userEndpointData)
            console.log(response.data.accessRouteLogs)
        }).then(() => {
            filterData({ userApiData, userEndpointData, accessRouteLogs });
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
                            spacing={2}>
                            <Grid
                                item
                                xs={4}>
                                <BarChart chartData={chartData} />
                            </Grid>
                            <Grid
                                item
                                xs={4}>
                                <BarChart chartData={chartData} />
                            </Grid>
                            <Grid
                                item
                                xs={4}>
                                <BarChart chartData={chartData} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box
                        direction="row"
                        marginTop={2}>
                        <Grid
                            container
                            spacing={2}>
                            <Grid
                                item
                                xs={6}>
                                <Table />
                            </Grid>
                            <Grid
                                item
                                xs={6}>
                                <Table />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                            height: "auto",
                            mt: 2
                        }}>
                        <LogoutButton />
                    </Box>

                </Box>
            </ThemeProvider>
        </div>
    )
};

export default Admin;