import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Guess from "./pages/GuessGame";
import Puzzle from "./pages/PuzzleGame";
const App = () => {
  return (
    <>
      <Router>
        {/* <Guess /> */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="gaming-zone/guess/*" element={<Guess />} />
          <Route path="gaming-zone/puzzle" element={<Puzzle />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
