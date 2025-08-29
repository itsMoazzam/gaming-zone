import { Route, Routes } from "react-router-dom";

import MemoryGame from "../components/puzzle/MemoryCard";
import SlidingPuzzle from "../components/puzzle/sliding";
import SudokuSolver from "../components/puzzle/SodukuSolver";
import TicTacToeAI from "../components/puzzle/TicTakToe";
import NavbarPuzzle from "../components/puzzle/NavbarPuzzle";

const Puzzle = () => {
  return (
    <>
      <NavbarPuzzle />
      <Routes>
        <Route path="memory-card" element={<MemoryGame />} />
        <Route path="sliding-game" element={<SlidingPuzzle />} />
        <Route path="sudoku-solver" element={<SudokuSolver />} />
        <Route path="tic-tac-toe-ai" element={<TicTacToeAI />} />
      </Routes>
    </>
  );
};

export default Puzzle;
