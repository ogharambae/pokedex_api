import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Grid, Box } from "@mui/material";


function App() {
  const types = useRef([]);
  const [checkedState, setCheckedState] = useState([]);
  console.log(checkedState);

  useEffect(() => {
    async function getTypes() {
      const result = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json");
      types.current = result.data.map(type => type.english);
      setCheckedState(new Array(result.data.length).fill(false))
    }
    getTypes();
  }, [])

  return (
    <Grid container spacing={0}>
      <Box>
        Hello World
      </Box>
    </Grid>
  );
}

export default App;
