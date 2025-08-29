import React, { useState, useCallback } from "react";

const Card = ({ emoji, isFlipped, isMatched, onClick }) => {
  return (
    <div
      className={`relative cursor-pointer aspect-square flex items-center justify-center border rounded-lg text-3xl font-bold
        ${
          isFlipped || isMatched
            ? "bg-white text-black"
            : "bg-purple-600 text-transparent"
        }
      `}
      onClick={!isFlipped && !isMatched ? onClick : undefined}
    >
      {emoji}
    </div>
  );
};

const MemoryGame = () => {
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Start/reset the game
  const initGame = useCallback(() => {
    const cardPairs = [...emojis, ...emojis]
      .map((emoji, index) => ({ id: index, emoji }))
      .sort(() => Math.random() - 0.5);

    setCards(cardPairs);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  }, []);

  // Handle flipping a card
  const handleCardClick = (id) => {
    if (flipped.length >= 2 || flipped.includes(id) || matched.includes(id))
      return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves((prev) => prev + 1);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard.emoji === secondCard.emoji) {
        setMatched((prev) => [...prev, firstId, secondId]);
        setFlipped([]);

        if (matched.length + 2 === cards.length) {
          setTimeout(() => setGameWon(true), 300);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Game</h1>
      <p className="mb-2">Moves: {moves}</p>
      <p className="mb-4">
        Matched: {matched.length / 2}/{emojis.length}
      </p>

      <div className="grid grid-cols-4 gap-3 w-full max-w-md">
        {cards.map((card) => (
          <Card
            key={card.id}
            emoji={card.emoji}
            isFlipped={flipped.includes(card.id)}
            isMatched={matched.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      <button
        onClick={initGame}
        className="mt-6 px-6 py-2 bg-blue-600 rounded-lg font-bold text-white"
      >
        {cards.length === 0 ? "Start Game" : "Reset Game"}
      </button>

      {gameWon && (
        <div className="mt-4 text-lg font-bold text-green-400">
          🎉 You Won in {moves} moves! 🎉
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
