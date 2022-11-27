import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ErrorMessage = ({ msg }) => {
    const theme = useTheme();

    return (
        <Grid item xs={12} pt={1}>
            <Typography align="center" fontSize={"20px"} color={theme.primary.dark} letterSpacing={0.5}>
                {msg || "Server error, please try again"}
            </Typography>
        </Grid>
    );
};

export default ErrorMessage;
