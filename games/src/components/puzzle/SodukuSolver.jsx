// SudokuSolver.jsx
import React, { useState } from "react";

// --- Example Puzzles (0 = empty cell) ---
const puzzles = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]
];

// --- Solver (backtracking) ---
const isValid = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
};

const solveSudoku = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const SudokuSolver = () => {
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(puzzles[0])));
  const [message, setMessage] = useState("");

  const handleChange = (row, col, value) => {
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value === "" ? 0 : parseInt(value) || 0;
    setBoard(newBoard);
  };

  const checkBoard = () => {
    // Check if all cells are filled and valid
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 || !isValid(board, r, c, board[r][c])) {
          setMessage("❌ Incorrect or incomplete solution.");
          return;
        }
      }
    }
    setMessage("✅ Congratulations! Puzzle solved!");
  };

  const solvePuzzle = () => {
    const newBoard = board.map((r) => [...r]);
    solveSudoku(newBoard);
    setBoard(newBoard);
    setMessage("✅ Puzzle solved automatically.");
  };

  const newGame = () => {
    setBoard(JSON.parse(JSON.stringify(puzzles[0])));
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Sudoku Solver</h1>

      <div className="grid grid-cols-9 gap-1">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <input
              key={`${rIdx}-${cIdx}`}
              type="text"
              maxLength="1"
              value={cell === 0 ? "" : cell}
              onChange={(e) => handleChange(rIdx, cIdx, e.target.value)}
              className="w-10 h-10 text-center border border-gray-400"
            />
          ))
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={newGame}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          New Game
        </button>
        <button
          onClick={checkBoard}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Check
        </button>
        <button
          onClick={solvePuzzle}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Solve
        </button>
      </div>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default SudokuSolver;
