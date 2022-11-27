import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SearchBar from "../Components/SearchBar";
import FilteredPagination from "../Components/FilteredPagination";

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
    <>
      <SearchBar types={types} checkedState={checkedState} setCheckedState={setCheckedState} />
      <FilteredPagination types={types} checkedState={checkedState} />
    </>
  )
}

export default App
