import { Route, Routes } from "react-router-dom";

import MemoryGame from "../components/puzzle/MemoryCard";
import SlidingPuzzle from "../components/puzzle/sliding";
import SudokuSolver from "../components/puzzle/SodukuSolver";
import TicTacToeAI from "../components/puzzle/TicTakToe";
import NavbarPuzzle from "../components/puzzle/NavbarPuzzle";

const Puzzle = () => {
  return (
    <>
      <Routes>
        <NavbarPuzzle />
        <Route path="gaming-zone/guess-word-game" element={<MemoryGame />} />
        <Route path="gaming-zone/guess-game" element={<SlidingPuzzle />} />
        <Route path="gaming-zone/wordle-game" element={<SudokuSolver />} />
        <Route path="gaming-zone/hangman-game" element={<TicTacToeAI />} />
        <Route
          path="gaming-zone/rock-paper-scissors-game"
          element={<RockPaperScissors />}
        />
      </Routes>
    </>
  );
};

export default Puzzle;
