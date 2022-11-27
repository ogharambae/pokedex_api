import React from "react";
import { Grid, Typography } from "@mui/material";

const ErrorMessage = ({ msg }) => {

    return (
        <Grid item xs={12} pt={1}>
            <Typography align="center" fontSize={"20px"} letterSpacing={0.5} color={"red"}>
                {msg || "Server error, please try again"}
            </Typography>
        </Grid>
    );
};

export default ErrorMessage;
