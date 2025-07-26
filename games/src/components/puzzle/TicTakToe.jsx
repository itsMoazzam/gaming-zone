import React, { useState, useEffect, useCallback, memo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

// Tic-Tac-Toe cell component with memo
const TicTacToeCell = memo(({ value, onClick, isWinning, darkMode }) => {
  return (
    <motion.button
      className={`flex items-center justify-center text-6xl font-bold rounded-xl ${
        darkMode
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-white hover:bg-gray-100"
      } ${isWinning ? (darkMode ? "bg-green-800" : "bg-green-200") : ""}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      {value === "X" && (
        <motion.span
          className={`${darkMode ? "text-red-400" : "text-red-600"}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          X
        </motion.span>
      )}
      {value === "O" && (
        <motion.span
          className={`${darkMode ? "text-blue-400" : "text-blue-600"}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          O
        </motion.span>
      )}
    </motion.button>
  );
});

const TicTacToeAI = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [gameMode, setGameMode] = useState("human-vs-ai");
  const [difficulty, setDifficulty] = useState("unbeatable");
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    streak: 0,
    maxStreak: 0
  });
  const [isThinking, setIsThinking] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  // Check for winner
  const checkWinner = useCallback((currentBoard) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], winningCells: pattern };
      }
    }

    // Check for draw
    if (!currentBoard.includes(null)) {
      return { winner: "draw", winningCells: [] };
    }

    return { winner: null, winningCells: [] };
  }, []);

  // Minimax algorithm for AI
  const minimax = useCallback(
    (currentBoard, depth, isMaximizing, alpha, beta) => {
      const result = checkWinner(currentBoard);

      if (result.winner === "X") return { score: -10 + depth };
      if (result.winner === "O") return { score: 10 - depth };
      if (result.winner === "draw") return { score: 0 };

      if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < currentBoard.length; i++) {
          if (currentBoard[i] === null) {
            currentBoard[i] = "O";
            const { score } = minimax(
              currentBoard,
              depth + 1,
              false,
              alpha,
              beta
            );
            currentBoard[i] = null;

            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }

            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) break;
          }
        }

        return { score: bestScore, move: bestMove };
      } else {
        let bestScore = Infinity;
        let bestMove = null;

        for (let i = 0; i < currentBoard.length; i++) {
          if (currentBoard[i] === null) {
            currentBoard[i] = "X";
            const { score } = minimax(
              currentBoard,
              depth + 1,
              true,
              alpha,
              beta
            );
            currentBoard[i] = null;

            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }

            beta = Math.min(beta, bestScore);
            if (beta <= alpha) break;
          }
        }

        return { score: bestScore, move: bestMove };
      }
    },
    [checkWinner]
  );

  // AI move based on difficulty
  const makeAIMove = useCallback(() => {
    if (winner) return;

    setIsThinking(true);

    setTimeout(() => {
      let move;
      const emptyCells = board.reduce((acc, val, idx) => {
        if (val === null) acc.push(idx);
        return acc;
      }, []);

      if (difficulty === "easy") {
        // Random move (easy)
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      } else if (difficulty === "medium") {
        // Sometimes smart, sometimes random (medium)
        if (Math.random() > 0.5) {
          const { move: smartMove } = minimax(
            [...board],
            0,
            true,
            -Infinity,
            Infinity
          );
          move = smartMove;
        } else {
          move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
      } else {
        // Unbeatable (hard)
        const { move: bestMove } = minimax(
          [...board],
          0,
          true,
          -Infinity,
          Infinity
        );
        move = bestMove;
      }

      const newBoard = [...board];
      newBoard[move] = "O";
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningCells(result.winningCells);

        // Update stats
        setStats((prev) => {
          let newStats = { ...prev };
          if (result.winner === "X") {
            newStats.wins += 1;
            newStats.streak += 1;
            newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
          } else if (result.winner === "O") {
            newStats.losses += 1;
            newStats.streak = 0;
          } else {
            newStats.draws += 1;
          }
          return newStats;
        });

        // Add to game history
        setGameHistory((prev) => [
          {
            date: new Date().toLocaleString(),
            result:
              result.winner === "X"
                ? "Win"
                : result.winner === "O"
                ? "Loss"
                : "Draw",
            difficulty,
            moves: newBoard.filter((cell) => cell !== null).length
          },
          ...prev.slice(0, 9)
        ]);
      } else {
        setPlayer("X");
      }

      setIsThinking(false);
    }, 500);
  }, [board, winner, difficulty, minimax, checkWinner]);

  // Handle player move
  const handleCellClick = useCallback(
    (index) => {
      if (
        winner ||
        board[index] !== null ||
        player !== "X" ||
        gameMode === "ai-vs-ai"
      )
        return;

      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningCells(result.winningCells);

        // Update stats
        setStats((prev) => {
          let newStats = { ...prev };
          if (result.winner === "X") {
            newStats.wins += 1;
            newStats.streak += 1;
            newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
          } else if (result.winner === "O") {
            newStats.losses += 1;
            newStats.streak = 0;
          } else {
            newStats.draws += 1;
          }
          return newStats;
        });

        // Add to game history
        setGameHistory((prev) => [
          {
            date: new Date().toLocaleString(),
            result:
              result.winner === "X"
                ? "Win"
                : result.winner === "O"
                ? "Loss"
                : "Draw",
            difficulty,
            moves: newBoard.filter((cell) => cell !== null).length
          },
          ...prev.slice(0, 9)
        ]);
      } else {
        setPlayer("O");
      }
    },
    [board, winner, player, gameMode, checkWinner, difficulty]
  );

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
    setWinningCells([]);
  }, []);

  // AI vs AI mode
  const runAIVsAI = useCallback(() => {
    if (gameMode !== "ai-vs-ai") return;

    if (!winner) {
      setIsThinking(true);

      setTimeout(() => {
        const currentPlayer = player;
        const { move } = minimax(
          [...board],
          0,
          currentPlayer === "O",
          -Infinity,
          Infinity
        );

        const newBoard = [...board];
        newBoard[move] = currentPlayer;
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result.winner) {
          setWinner(result.winner);
          setWinningCells(result.winningCells);

          // Add to game history
          setGameHistory((prev) => [
            {
              date: new Date().toLocaleString(),
              result:
                result.winner === "X"
                  ? "AI 1 Win"
                  : result.winner === "O"
                  ? "AI 2 Win"
                  : "Draw",
              difficulty: "AI vs AI",
              moves: newBoard.filter((cell) => cell !== null).length
            },
            ...prev.slice(0, 9)
          ]);
        } else {
          setPlayer(currentPlayer === "X" ? "O" : "X");
        }

        setIsThinking(false);
      }, 500);
    }
  }, [board, winner, player, gameMode, minimax, checkWinner]);

  // Effect for AI moves
  useEffect(() => {
    if (gameMode === "human-vs-ai" && player === "O" && !winner) {
      makeAIMove();
    } else if (gameMode === "ai-vs-ai" && !winner && !isThinking) {
      runAIVsAI();
    }
  }, [player, winner, gameMode, makeAIMove, runAIVsAI, isThinking]);

  // Background geometric animations
  const backgroundShapes = Array.from({ length: 12 }).map((_, i) => {
    const size = Math.random() * 100 + 50;
    const rotation = Math.random() * 360;
    const duration = Math.random() * 20 + 10;
    const shapeType = Math.random() > 0.5 ? "circle" : "square";

    return (
      <motion.div
        key={i}
        className={`absolute ${darkMode ? "bg-white/5" : "bg-black/5"} border ${
          darkMode ? "border-white/10" : "border-black/10"
        } ${shapeType === "circle" ? "rounded-full" : "rounded-lg"}`}
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
        className="text-center mb-6 z-10 w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Tic-Tac-Toe AI</h1>
        <p className="text-lg mb-4">
          {gameMode === "human-vs-ai"
            ? "Human (X) vs AI (O)"
            : gameMode === "ai-vs-ai"
            ? "AI (X) vs AI (O)"
            : "Human vs Human"}
        </p>
      </motion.div>

      {/* Game status */}
      <motion.div
        className="mb-6 text-xl font-bold z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {winner ? (
          winner === "draw" ? (
            <span>Game ended in a draw!</span>
          ) : (
            <span>
              {winner === "X"
                ? gameMode === "human-vs-ai"
                  ? "You win!"
                  : "AI 1 wins!"
                : gameMode === "human-vs-ai"
                ? "AI wins!"
                : "AI 2 wins!"}
            </span>
          )
        ) : isThinking ? (
          <span>AI is thinking...</span>
        ) : (
          <span>
            {gameMode === "human-vs-ai"
              ? player === "X"
                ? "Your turn (X)"
                : "AI thinking..."
              : gameMode === "ai-vs-ai"
              ? "AI vs AI in progress..."
              : `Player ${player}'s turn`}
          </span>
        )}
      </motion.div>

      {/* Game board */}
      <motion.div
        className={`grid grid-cols-3 gap-3 w-full max-w-xs aspect-square z-10 mb-6 ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        } p-3 rounded-xl shadow-xl`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        {board.map((cell, index) => (
          <TicTacToeCell
            key={index}
            value={cell}
            onClick={() => handleCellClick(index)}
            isWinning={winningCells.includes(index)}
            darkMode={darkMode}
          />
        ))}
      </motion.div>

      {/* Game controls */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
        >
          New Game
        </motion.button>

        <select
          className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-300"
          } border`}
          value={gameMode}
          onChange={(e) => {
            setGameMode(e.target.value);
            resetGame();
          }}
        >
          <option value="human-vs-ai">Human vs AI</option>
          <option value="ai-vs-ai">AI vs AI</option>
          <option value="human-vs-human">Human vs Human</option>
        </select>

        {gameMode === "human-vs-ai" && (
          <select
            className={`px-4 py-2 rounded-lg shadow-lg font-medium ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            } border`}
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              resetGame();
            }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="unbeatable">Unbeatable</option>
          </select>
        )}

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

      {/* Stats panel */}
      <motion.div
        className={`rounded-xl p-4 w-full max-w-md mb-6 ${
          darkMode ? "bg-gray-800/80" : "bg-white/80"
        } backdrop-blur-sm shadow-lg z-10`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-xl font-bold mb-3 text-center">Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.wins}</div>
            <div>Wins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.losses}</div>
            <div>Losses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.draws}</div>
            <div>Draws</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.streak}</div>
            <div>Current Streak</div>
          </div>
          <div className="text-center col-span-2">
            <div className="text-lg font-bold">
              Max Streak: {stats.maxStreak}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Game history */}
      {gameHistory.length > 0 && (
        <motion.div
          className={`rounded-xl p-4 w-full max-w-md ${
            darkMode ? "bg-gray-800/80" : "bg-white/80"
          } backdrop-blur-sm shadow-lg z-10`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-xl font-bold mb-3 text-center">Recent Games</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {gameHistory.map((game, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700/50" : "bg-gray-100"
                } flex justify-between items-center`}
              >
                <span>
                  {game.result} ({game.moves} moves)
                </span>
                <span className="text-sm opacity-70">{game.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Game won overlay */}
      <AnimatePresence>
        {winner && (
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
                  {winner === "draw"
                    ? "Game Ended in a Draw!"
                    : winner === "X"
                    ? gameMode === "human-vs-ai"
                      ? "🎉 You Win! 🎉"
                      : "🤖 AI 1 Wins!"
                    : gameMode === "human-vs-ai"
                    ? "🤖 AI Wins!"
                    : "🤖 AI 2 Wins!"}
                </h2>
                <div className="flex justify-center gap-4">
                  <motion.button
                    className={`px-6 py-2 rounded-lg shadow-lg font-medium ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                  >
                    Play Again
                  </motion.button>
                </div>
              </div>

              {/* Confetti effect for wins */}
              {winner === "X" && gameMode === "human-vs-ai" && (
                <>
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
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI thinking overlay */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4"
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
              <h2 className="text-xl font-bold">AI is thinking...</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicTacToeAI;
