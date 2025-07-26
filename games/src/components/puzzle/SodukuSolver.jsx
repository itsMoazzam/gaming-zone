/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Sudoku cell component with memo
const SudokuCell = memo(
  ({
    value,
    row,
    col,
    isInitial,
    isSelected,
    isHighlighted,
    isInvalid,
    onClick,
    onChange
  }) => {
    const handleChange = (e) => {
      const input = e.target.value;
      if (input === "" || (input >= "1" && input <= "9")) {
        onChange(row, col, input === "" ? "" : parseInt(input));
      }
    };

    return (
      <motion.div
        className={`flex items-center justify-center text-2xl font-medium border border-gray-400 relative ${
          isInitial ? "bg-gray-100" : "bg-white"
        } ${col % 3 === 2 && col !== 8 ? "border-r-2 border-r-black" : ""} ${
          row % 3 === 2 && row !== 8 ? "border-b-2 border-b-black" : ""
        } ${isSelected ? "bg-blue-100" : ""} ${
          isHighlighted ? "bg-blue-50" : ""
        } ${isInvalid ? "bg-red-100" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(row, col)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {isInitial ? (
          <span className="text-gray-800">{value}</span>
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={handleChange}
            className="w-full h-full text-center bg-transparent focus:outline-none"
            maxLength="1"
          />
        )}
      </motion.div>
    );
  }
);

const SudokuSolver = () => {
  const [board, setBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(""))
  );
  const [initialBoard, setInitialBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [isSolving, setIsSolving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [solved, setSolved] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timer, setTimer] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!solved && board.some((row) => row.some((cell) => cell !== ""))) {
        setTimer((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [board, solved]);

  // Generate a new Sudoku puzzle
  const generateSudoku = useCallback(() => {
    setIsGenerating(true);
    setSolved(false);
    setMistakes(0);
    setHintsUsed(0);
    setTimer(0);

    // Generate a solved board first
    const solvedBoard = solveSudoku(
      Array(9)
        .fill()
        .map(() => Array(9).fill(""))
    );

    // Then remove numbers based on difficulty
    const cellsToRemove =
      difficulty === "easy"
        ? 40
        : difficulty === "medium"
        ? 50
        : difficulty === "hard"
        ? 60
        : 45;

    const newBoard = JSON.parse(JSON.stringify(solvedBoard));
    let cellsRemoved = 0;

    while (cellsRemoved < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (newBoard[row][col] !== "") {
        newBoard[row][col] = "";
        cellsRemoved++;
      }
    }

    setBoard(newBoard);
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)));

    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  }, [difficulty]);

  // Solve Sudoku using backtracking
  const solveSudoku = (board) => {
    const newBoard = JSON.parse(JSON.stringify(board));

    const isValid = (row, col, num) => {
      // Check row
      for (let x = 0; x < 9; x++) {
        if (newBoard[row][x] === num) return false;
      }

      // Check column
      for (let x = 0; x < 9; x++) {
        if (newBoard[x][col] === num) return false;
      }

      // Check 3x3 box
      const boxRowStart = row - (row % 3);
      const boxColStart = col - (col % 3);

      for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
          if (newBoard[r][c] === num) return false;
        }
      }

      return true;
    };

    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (newBoard[row][col] === "") {
            for (let num = 1; num <= 9; num++) {
              if (isValid(row, col, num)) {
                newBoard[row][col] = num;
                if (solve()) {
                  return true;
                }
                newBoard[row][col] = "";
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    solve();
    return newBoard;
  };

  // Auto-solve the puzzle
  const autoSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      const solvedBoard = solveSudoku(board);
      setBoard(solvedBoard);
      setIsSolving(false);
      setSolved(true);
    }, 500);
  };

  // Handle cell selection
  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] !== "") return;
    setSelectedCell({ row, col });
  };

  // Handle cell value change
  const handleCellChange = (row, col, value) => {
    if (initialBoard[row][col] !== "") return;

    const newBoard = [...board];
    newBoard[row][col] = value;
    setBoard(newBoard);

    // Check if the move is valid
    if (value !== "") {
      let isValid = true;

      // Check row
      for (let x = 0; x < 9; x++) {
        if (x !== col && newBoard[row][x] === value) {
          isValid = false;
          break;
        }
      }

      // Check column
      for (let x = 0; x < 9; x++) {
        if (x !== row && newBoard[x][col] === value) {
          isValid = false;
          break;
        }
      }

      // Check 3x3 box
      const boxRowStart = row - (row % 3);
      const boxColStart = col - (col % 3);

      for (let r = boxRowStart; r < boxRowStart + 3; r++) {
        for (let c = boxColStart; c < boxColStart + 3; c++) {
          if (r !== row && c !== col && newBoard[r][c] === value) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }

      if (!isValid) {
        setMistakes((prev) => prev + 1);
      }
    }

    // Check if puzzle is solved
    if (isPuzzleSolved(newBoard)) {
      setSolved(true);
    }
  };

  // Check if puzzle is solved
  const isPuzzleSolved = (currentBoard) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] === "") return false;
      }
    }
    return true;
  };

  // Provide a hint
  const provideHint = () => {
    if (
      !selectedCell ||
      initialBoard[selectedCell.row][selectedCell.col] !== ""
    )
      return;

    const solvedBoard = solveSudoku(initialBoard);
    const newBoard = [...board];
    newBoard[selectedCell.row][selectedCell.col] =
      solvedBoard[selectedCell.row][selectedCell.col];
    setBoard(newBoard);
    setHintsUsed((prev) => prev + 1);

    // Check if puzzle is solved
    if (isPuzzleSolved(newBoard)) {
      setSolved(true);
    }
  };

  // Background geometric animations
  const backgroundShapes = Array.from({ length: 12 }).map((_, i) => {
    const size = Math.random() * 100 + 50;
    const rotation = Math.random() * 360;
    const duration = Math.random() * 20 + 10;
    const shapeType = Math.random() > 0.5 ? "circle" : "square";

    return (
      <motion.div
        key={i}
        className={`absolute bg-white/5 border border-white/10 ${
          shapeType === "circle" ? "rounded-full" : "rounded-lg"
        }`}
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
        initial={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          rotate: rotation
        }}
        animate={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          rotate: rotation + 360,
          transition: {
            duration: duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }
        }}
      />
    );
  });

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Initialize game on first render
  useEffect(() => {
    generateSudoku();
  }, [generateSudoku]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } flex flex-col items-center justify-center p-4 overflow-hidden relative`}
    >
      {/* Background shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {backgroundShapes}
      </div>

      {/* Game header */}
      <motion.div
        className="text-center mb-6 z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Sudoku Solver</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span>Time:</span>
            <span className="font-bold">{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Mistakes:</span>
            <span className="font-bold">{mistakes}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Hints:</span>
            <span className="font-bold">{hintsUsed}</span>
          </div>
        </div>
      </motion.div>

      {/* Game controls */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSudoku}
        >
          New Game
        </motion.button>

        <motion.button
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={autoSolve}
          disabled={isSolving || solved}
        >
          {isSolving ? "Solving..." : "Auto Solve"}
        </motion.button>

        <motion.button
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-500 hover:bg-purple-600"
          } text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={provideHint}
          disabled={!selectedCell || solved}
        >
          Get Hint
        </motion.button>

        <select
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-300"
          } border`}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <motion.button
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </motion.button>
      </motion.div>

      {/* Sudoku board */}
      <motion.div
        className={`grid grid-cols-9 gap-0.5 w-full max-w-lg aspect-square z-10 ${
          darkMode ? "bg-gray-700" : "bg-gray-300"
        } p-1 rounded-lg shadow-xl`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected =
              selectedCell &&
              selectedCell.row === rowIndex &&
              selectedCell.col === colIndex;
            const isHighlighted =
              selectedCell &&
              (selectedCell.row === rowIndex ||
                selectedCell.col === colIndex ||
                (Math.floor(selectedCell.row / 3) ===
                  Math.floor(rowIndex / 3) &&
                  Math.floor(selectedCell.col / 3) ===
                    Math.floor(colIndex / 3)));

            // Check if current cell is invalid (duplicate in row, column or box)
            let isInvalid = false;
            if (cell !== "" && !isSelected) {
              // Check row
              for (let x = 0; x < 9; x++) {
                if (x !== colIndex && board[rowIndex][x] === cell) {
                  isInvalid = true;
                  break;
                }
              }

              // Check column
              for (let x = 0; x < 9; x++) {
                if (x !== rowIndex && board[x][colIndex] === cell) {
                  isInvalid = true;
                  break;
                }
              }

              // Check 3x3 box
              const boxRowStart = rowIndex - (rowIndex % 3);
              const boxColStart = colIndex - (colIndex % 3);

              for (let r = boxRowStart; r < boxRowStart + 3; r++) {
                for (let c = boxColStart; c < boxColStart + 3; c++) {
                  if (
                    r !== rowIndex &&
                    c !== colIndex &&
                    board[r][c] === cell
                  ) {
                    isInvalid = true;
                    break;
                  }
                }
                if (isInvalid) break;
              }
            }

            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                row={rowIndex}
                col={colIndex}
                isInitial={initialBoard[rowIndex][colIndex] !== ""}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isInvalid={isInvalid}
                onClick={handleCellClick}
                onChange={handleCellChange}
              />
            );
          })
        )}
      </motion.div>

      {/* Game won overlay */}
      <AnimatePresence>
        {solved && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-xl p-8 max-w-md w-full shadow-2xl border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } text-center relative overflow-hidden`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div
                className={`absolute inset-0 ${
                  darkMode ? "bg-white/5" : "bg-black/5"
                }`}
              />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4">
                  🎉 Puzzle Solved! 🎉
                </h2>
                <div className="space-y-2 mb-6">
                  <p>
                    Time: <span className="font-bold">{formatTime(timer)}</span>
                  </p>
                  <p>
                    Mistakes: <span className="font-bold">{mistakes}</span>
                  </p>
                  <p>
                    Hints used: <span className="font-bold">{hintsUsed}</span>
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <motion.button
                    className={`px-6 py-2 rounded-lg shadow-lg font-medium ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateSudoku}
                  >
                    Play Again
                  </motion.button>
                </div>
              </div>

              {/* Confetti effect */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: -50,
                    opacity: 1,
                    rotate: 0
                  }}
                  animate={{
                    y: "100vh",
                    opacity: 0,
                    rotate: 360,
                    transition: {
                      duration: 2 + Math.random() * 3,
                      delay: i * 0.1
                    }
                  }}
                >
                  {["🎉", "🎊", "✨", "🌟", "💫"][i % 5]}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h2 className="text-xl font-bold">Generating Puzzle...</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SudokuSolver;
