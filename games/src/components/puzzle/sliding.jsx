import React, { useState } from "react";

const shuffle = (arr) => {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const SlidingPuzzle = () => {
  const [tiles, setTiles] = useState(shuffle([...Array(9).keys()])); // 0–8

  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(8); // empty space
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 3,
      emptyIndex + 3
    ];

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index]
      ];
      setTiles(newTiles);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">Sliding Puzzle (3x3)</h1>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((num, i) => (
          <button
            key={i}
            onClick={() => moveTile(i)}
            className={`w-16 h-16 flex items-center justify-center text-lg font-bold rounded ${
              num === 8 ? "bg-gray-200" : "bg-blue-500 text-white"
            }`}
          >
            {num !== 8 ? num + 1 : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlidingPuzzle;
