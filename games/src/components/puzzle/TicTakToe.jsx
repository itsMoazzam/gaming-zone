import React, { useState } from "react";

const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : "draw";
};

const minimax = (board, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === "O") return { score: 1 };
  if (winner === "X") return { score: -1 };
  if (winner === "draw") return { score: 0 };

  if (isMaximizing) {
    let best = { score: -Infinity };
    board.forEach((cell, i) => {
      if (!cell) {
        board[i] = "O";
        const score = minimax(board, false).score;
        board[i] = null;
        if (score > best.score) best = { score, move: i };
      }
    });
    return best;
  } else {
    let best = { score: Infinity };
    board.forEach((cell, i) => {
      if (!cell) {
        board[i] = "X";
        const score = minimax(board, true).score;
        board[i] = null;
        if (score < best.score) best = { score, move: i };
      }
    });
    return best;
  }
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  const handleClick = (i) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      return;
    }

    // AI move
    const { move } = minimax(newBoard, true);
    if (move !== undefined) {
      newBoard[move] = "O";
      setBoard([...newBoard]);
      setWinner(checkWinner(newBoard));
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Tic Tac Toe (vs AI)</h1>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-16 h-16 text-3xl font-bold border border-gray-500"
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <p className="mb-4 text-lg font-bold">
          {winner === "draw" ? "It's a draw!" : `${winner} wins!`}
        </p>
      )}

      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        New Game
      </button>
    </div>
  );
};

export default TicTacToe;
