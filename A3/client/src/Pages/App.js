import React, { useEffect, useState, useRef } from "react";
import { createTheme } from "@mui/material/styles";
import axios from "axios";
import { Box, TextField, Typography, Button, Grid, ThemeProvider } from "@mui/material";

import SearchBar from "../components/SearchBar";
import FilteredPagination from "../components/FilteredPagination";
import bgImage from "../assets/images/pokedex-background.jpg";
import LogoutButton from "../components/LogoutButton"


export const customTheme = createTheme({
  typography: {
    fontFamily: "PixGamer"
  }
});

function App() {
  const types = useRef([]);
  const [checkedState, setCheckedState] = useState([]);

  const appPageStyle = {
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

  useEffect(() => {
    async function getTypes() {
      const result = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json");
      types.current = result.data.map(type => type.english);
      setCheckedState(new Array(result.data.length).fill(false))
    }
    getTypes();
  }, [])

  return (
    <div className="Login-component" style={appPageStyle}>
      <ThemeProvider theme={customTheme}>
        <Box
          sx={{ mt: 10 }}
          display={"flex"}
          flexDirection={"column"}
          alignItems="center"
          justifyContent="center">
          <SearchBar types={types} checkedState={checkedState} setCheckedState={setCheckedState} />
        </Box>
        <FilteredPagination types={types} checkedState={checkedState} />
        <Grid
          container
          justifyContent={"center"}
          sx={{ mt: 2 }}
        >
          <LogoutButton />
        </Grid>
      </ThemeProvider>
    </div>
  )
}

export default App
