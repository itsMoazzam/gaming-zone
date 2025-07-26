/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Card component with memo to prevent unnecessary re-renders
const Card = memo(({ emoji, isFlipped, isMatched, onClick }) => {
  return (
    <motion.div
      className="relative cursor-pointer aspect-square"
      onClick={!isFlipped && !isMatched ? onClick : null}
      initial={false}
      animate={{
        rotateY: isFlipped || isMatched ? 180 : 0,
        scale: isMatched ? 0.9 : 1
      }}
      transition={{ duration: 0.6, type: "spring" }}
      whileHover={!isFlipped && !isMatched ? { scale: 1.05 } : {}}
      whileTap={!isFlipped && !isMatched ? { scale: 0.95 } : {}}
    >
      {/* Card back */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center text-4xl"
        initial={false}
        animate={{
          opacity: isFlipped || isMatched ? 0 : 1,
          rotateY: isFlipped || isMatched ? 90 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-xl" />
        <div className="w-4/5 h-4/5 border-2 border-white/30 rounded-lg" />
      </motion.div>

      {/* Card front */}
      <motion.div
        className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center text-4xl ${
          isMatched
            ? "bg-gradient-to-br from-green-400 to-emerald-500"
            : "bg-white"
        }`}
        initial={false}
        animate={{
          opacity: isFlipped || isMatched ? 1 : 0,
          rotateY: isFlipped || isMatched ? 0 : 90
        }}
        transition={{ duration: 0.3 }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
});

// Game board component
const MemoryGame = () => {
  // Emojis for the cards (pairs)
  const emojis = React.useMemo(
    () => ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    []
  );
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  const initGame = useCallback(() => {
    // Create pairs of cards
    const cardPairs = [...emojis, ...emojis]
      .map((emoji, index) => ({ id: index, emoji }))
      .sort(() => Math.random() - 0.5);

    setCards(cardPairs);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
  }, [emojis]);

  // Handle card click
  const handleCardClick = useCallback(
    (id) => {
      // Don't allow more than 2 cards to be flipped at once
      if (flipped.length >= 2 || flipped.includes(id) || matched.includes(id))
        return;

      const newFlipped = [...flipped, id];
      setFlipped(newFlipped);
      setMoves((prev) => prev + 1);

      // Check for match if two cards are flipped
      if (newFlipped.length === 2) {
        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c) => c.id === firstId);
        const secondCard = cards.find((c) => c.id === secondId);

        if (firstCard.emoji === secondCard.emoji) {
          setMatched((prev) => [...prev, firstId, secondId]);
          setFlipped([]);

          // Check if all cards are matched
          if (matched.length + 2 === cards.length) {
            setTimeout(() => setGameWon(true), 500);
          }
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    },
    [flipped, matched, cards]
  );

  // Initialize game on first render
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Background shapes animation
  const backgroundShapes = Array.from({ length: 12 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full bg-white/5 border border-white/10"
      initial={{
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        width: `${Math.random() * 200 + 50}px`,
        height: `${Math.random() * 200 + 50}px`,
        rotate: Math.random() * 360
      }}
      animate={{
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        rotate: Math.random() * 360,
        transition: {
          duration: Math.random() * 30 + 20,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {backgroundShapes}
      </div>

      {/* Game header */}
      <motion.div
        className="text-center mb-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Memory Cards</h1>
        <p className="text-gray-300">
          Flip matching pairs in as few moves as possible
        </p>
        <div className="mt-2 text-lg">
          Moves: <span className="font-bold">{moves}</span> | Matched:{" "}
          <span className="font-bold">
            {matched.length / 2}/{emojis.length}
          </span>
        </div>
      </motion.div>

      {/* Game board */}
      <motion.div
        className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full max-w-md z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            emoji={card.emoji}
            isFlipped={flipped.includes(card.id)}
            isMatched={matched.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </motion.div>

      {/* Game controls */}
      <motion.div
        className="mt-6 z-10"
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
          Reset Game
        </motion.button>
      </motion.div>

      {/* Game won modal */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 max-w-md w-full shadow-2xl border border-white/10 relative overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="absolute inset-0 bg-white/5" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-center mb-4">
                  🎉 You Won! 🎉
                </h2>
                <p className="text-center mb-6">
                  You matched all pairs in{" "}
                  <span className="font-bold">{moves}</span> moves!
                </p>
                <div className="flex justify-center">
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

      {/* Game start overlay */}
      <AnimatePresence>
        {!gameStarted && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-30 p-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl border border-white/10 text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-3xl font-bold mb-4">Memory Cards</h2>
              <p className="mb-6 text-gray-300">
                Find all matching pairs in the fewest moves possible. Flip two
                cards at a time to find matches!
              </p>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initGame}
              >
                Start Game
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryGame;
