import React from 'react'
import Pokemon from './Pokemon'
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, Box, Grid } from "@mui/material";

export const customTheme = createTheme({
    typography: {
        fontFamily: "PixGamer"
    }
});

function Page({ currentPokemons }) {
    return (
        <div className="Login-component" >
            <ThemeProvider theme={customTheme}>
                <Grid
                    container
                    justifyContent="center">
                    {
                        currentPokemons.map((item) => {
                            return (
                                <div>
                                    <Box
                                        display={"flex"}
                                        alignItems="center"
                                        justifyContent="center"
                                        border={2}
                                        borderColor="info.main"
                                        maxWidth={400}
                                        paddingBottom={2}
                                        margin={2}
                                        backgroundColor="rgba(84, 195, 243, 0.6)">
                                        <Box
                                            marginTop={1}>
                                            <Pokemon pokemon={item} />
                                        </Box>
                                    </Box>
                                </div>
                            )
                        })
                    }
                </Grid>
            </ThemeProvider>
        </div >
    )
}

export default Page
