import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import FilteredPagination from "../components/FilteredPagination";

import bgImage from "../assets/images/pokedex-background.jpg";

function App() {
  const types = useRef([]);
  const [checkedState, setCheckedState] = useState([]);
  console.log(checkedState);

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
      <SearchBar types={types} checkedState={checkedState} setCheckedState={setCheckedState} />
      <FilteredPagination types={types} checkedState={checkedState} />

    </div>
  )
}

export default App
