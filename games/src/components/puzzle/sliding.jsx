/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tile component with memo to prevent unnecessary re-renders
const Tile = memo(({ value, index, emptyIndex, onClick, imageMode }) => {
  const rowLength = Math.sqrt(16); // 4x4 grid
  const currentRow = Math.floor(index / rowLength);
  const currentCol = index % rowLength;
  const emptyRow = Math.floor(emptyIndex / rowLength);
  const emptyCol = emptyIndex % rowLength;

  const isAdjacent =
    (Math.abs(currentRow - emptyRow) === 1 && currentCol === emptyCol) ||
    (Math.abs(currentCol - emptyCol) === 1 && currentRow === emptyRow);

  const handleClick = () => {
    if (isAdjacent) {
      onClick(index);
    }
  };

  // Calculate background position for image tiles
  const bgPosition = imageMode
    ? `${-(currentCol * 100)}% ${-(currentRow * 100)}%`
    : "center";

  return (
    <motion.div
      className={`absolute flex items-center justify-center text-3xl font-bold rounded-lg overflow-hidden ${
        imageMode ? "bg-cover bg-no-repeat" : "bg-blue-600 text-white"
      } ${value === 0 ? "invisible" : ""}`}
      style={{
        width: "calc(25% - 8px)",
        height: "calc(25% - 8px)",
        left: `calc(${currentCol * 25}% + 4px)`,
        top: `calc(${currentRow * 25}% + 4px)`,
        backgroundImage: imageMode
          ? "url(https://source.unsplash.com/random/600x600)"
          : "",
        backgroundPosition: bgPosition,
        cursor: isAdjacent ? "pointer" : "default",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
      }}
      initial={false}
      animate={{
        x: 0,
        y: 0,
        scale: 1
      }}
      whileHover={isAdjacent ? { scale: 1.05 } : {}}
      whileTap={isAdjacent ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      {!imageMode && value}
    </motion.div>
  );
});

const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(15);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [imageMode, setImageMode] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  // Initialize the game
  const initGame = useCallback(() => {
    const newTiles = Array.from({ length: 16 }, (_, i) => i);
    setTiles(newTiles);
    setEmptyIndex(15);
    setMoves(0);
    setGameWon(false);
    setShuffling(true);

    // Shuffle the tiles after a delay to allow initial render
    setTimeout(() => {
      shuffleTiles(newTiles);
    }, 500);
  }, []);

  // Shuffle the tiles
  const shuffleTiles = (initialTiles) => {
    let shuffled = [...initialTiles];
    let currentEmptyIndex = 15;
    let shuffleMoves = 0;
    const maxShuffleMoves = 100;

    const shuffleInterval = setInterval(() => {
      if (shuffleMoves >= maxShuffleMoves) {
        clearInterval(shuffleInterval);
        setShuffling(false);
        setTiles(shuffled);
        setEmptyIndex(currentEmptyIndex);
        return;
      }

      const possibleMoves = [];
      const rowLength = 4;
      const emptyRow = Math.floor(currentEmptyIndex / rowLength);
      const emptyCol = currentEmptyIndex % rowLength;

      // Check adjacent tiles
      if (emptyRow > 0) possibleMoves.push(currentEmptyIndex - rowLength); // Up
      if (emptyRow < rowLength - 1)
        possibleMoves.push(currentEmptyIndex + rowLength); // Down
      if (emptyCol > 0) possibleMoves.push(currentEmptyIndex - 1); // Left
      if (emptyCol < rowLength - 1) possibleMoves.push(currentEmptyIndex + 1); // Right

      // Randomly select an adjacent tile to swap
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // Swap tiles
      const temp = shuffled[randomMove];
      shuffled[randomMove] = shuffled[currentEmptyIndex];
      shuffled[currentEmptyIndex] = temp;

      currentEmptyIndex = randomMove;
      shuffleMoves++;
    }, 20);
  };

  // Handle tile click
  const handleTileClick = useCallback(
    (clickedIndex) => {
      if (shuffling || gameWon) return;

      const rowLength = 4;
      const clickedRow = Math.floor(clickedIndex / rowLength);
      const clickedCol = clickedIndex % rowLength;
      const emptyRow = Math.floor(emptyIndex / rowLength);
      const emptyCol = emptyIndex % rowLength;

      // Check if clicked tile is adjacent to empty space
      const isAdjacent =
        (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
        (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

      if (isAdjacent) {
        // Swap tiles
        const newTiles = [...tiles];
        newTiles[emptyIndex] = newTiles[clickedIndex];
        newTiles[clickedIndex] = 0;

        setTiles(newTiles);
        setEmptyIndex(clickedIndex);
        setMoves(moves + 1);

        // Check if puzzle is solved
        if (isPuzzleSolved(newTiles)) {
          setGameWon(true);
        }
      }
    },
    [tiles, emptyIndex, moves, shuffling, gameWon]
  );

  // Check if puzzle is solved
  const isPuzzleSolved = (currentTiles) => {
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] !== i + 1) {
        return false;
      }
    }
    return currentTiles[currentTiles.length - 1] === 0;
  };

  // Initialize game on first render
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Background geometric animations
  const backgroundShapes = Array.from({ length: 8 }).map((_, i) => {
    const size = Math.random() * 100 + 50;
    const rotation = Math.random() * 360;
    const duration = Math.random() * 20 + 10;

    return (
      <motion.div
        key={i}
        className="absolute bg-white/5 border border-white/10 rounded-full"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Sliding Puzzle</h1>
        <p className="text-gray-300 mb-4">
          Slide tiles to restore the {imageMode ? "image" : "number sequence"}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            Moves: <span className="font-bold">{moves}</span>
          </div>
          <motion.button
            className="px-4 py-2 bg-white/10 rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setImageMode(!imageMode)}
          >
            {imageMode ? "Number Mode" : "Image Mode"}
          </motion.button>
        </div>
      </motion.div>

      {/* Game board */}
      <motion.div
        className="relative w-full max-w-md aspect-square bg-gray-700 rounded-xl p-2 shadow-xl z-10"
        style={{
          backgroundImage: imageMode
            ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
            : "",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {tiles.map((value, index) => (
          <Tile
            key={`${value}-${index}`}
            value={value}
            index={index}
            emptyIndex={emptyIndex}
            onClick={handleTileClick}
            imageMode={imageMode}
          />
        ))}
      </motion.div>

      {/* Game controls */}
      <motion.div
        className="mt-6 flex gap-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={initGame}
        >
          New Game
        </motion.button>
      </motion.div>

      {/* Game won overlay */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl border border-white/10 text-center relative overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="absolute inset-0 bg-white/5" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4">
                  🎉 Puzzle Solved! 🎉
                </h2>
                <p className="mb-6">
                  You completed the puzzle in{" "}
                  <span className="font-bold">{moves}</span> moves!
                </p>
                <div className="flex justify-center gap-4">
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={initGame}
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

      {/* Shuffling overlay */}
      <AnimatePresence>
        {shuffling && (
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
              <h2 className="text-xl font-bold">Shuffling Puzzle...</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SlidingPuzzle;
