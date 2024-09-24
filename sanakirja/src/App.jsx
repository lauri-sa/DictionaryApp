import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Add from "./pages/Add";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home/>}/>
          <Route path="search" element={<Search/>}/>
          <Route path="add" element={<Add/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
