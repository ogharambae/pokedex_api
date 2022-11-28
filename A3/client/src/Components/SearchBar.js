import React from 'react'
import { Box, ThemeProvider, FormGroup, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
    typography: {
        fontFamily: "PixGamer"
    }
});

function SearchBar({ types, checkedState, setCheckedState }) {
    const onChangeHandle = (type) => {
        const index = types.current.indexOf(type);
        const newCheckedState = checkedState.map((item, i) => i === index ? !item : item);
        setCheckedState(newCheckedState);
    }

    return (
        <div className="Login-component" >
            <ThemeProvider theme={customTheme}>
                <Box
                    alignItems="center"
                    justifyContent="center">
                    <Typography
                        sx={{ mt: 5, mb: 2 }}
                        align="center"
                        variant="h4"
                        fontWeight="bold">
                        Search by Type!
                    </Typography>
                    <FormGroup
                        aria-label="position"
                        row
                        sx={{ mt: 3, mb: 5 }}>
                        {
                            types.current.map(type => {
                                return (
                                    <FormControlLabel control={<Checkbox />}
                                        label={<Typography
                                            fontWeight="bold"
                                            variant="body1">
                                            {type}
                                        </Typography>}
                                        onClick={() => { onChangeHandle(type) }} />

                                )
                            })
                        }
                    </FormGroup>
                </Box>
            </ThemeProvider>
        </div>
    )
}

export default SearchBar