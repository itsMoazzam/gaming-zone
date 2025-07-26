import React, { useState, useEffect } from "react";

const words = ["REACT", "TAILWIND", "JAVASCRIPT", "PYTHON", "HANGMAN"];

const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

const MAX_ATTEMPTS = 6;

const Hangman = () => {
  const [word, setWord] = useState(getRandomWord);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");

  const handleKeyPress = (e) => {
    if (gameStatus !== "playing") return;

    const letter = e.key.toUpperCase();
    if (!/^[A-Z]$/.test(letter) || guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setWrongAttempts((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const uniqueLetters = [...new Set(word.split(""))];
    const allGuessed = uniqueLetters.every((l) => guessedLetters.includes(l));

    if (allGuessed) {
      setGameStatus("won");
    } else if (wrongAttempts >= MAX_ATTEMPTS) {
      setGameStatus("lost");
    }
  }, [guessedLetters, wrongAttempts, word]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  const resetGame = () => {
    setWord(getRandomWord);
    setGuessedLetters([]);
    setWrongAttempts(0);
    setGameStatus("playing");
  };

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-400 via-rose-300 to-violet-500 flex items-center justify-center font-mono text-white px-4 overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-pink-300 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 left-2/3 w-72 h-72 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-300 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl shadow-xl p-6 rounded-xl w-full max-w-lg text-center z-10">
        <h1 className="text-3xl font-bold mb-4">🔤 Hangman Game</h1>

        <p className="text-xl tracking-widest font-semibold mb-4">
          {displayWord}
        </p>
        <p className="mb-3">
          Wrong Attempts: {wrongAttempts}/{MAX_ATTEMPTS}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => (
            <span
              key={letter}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                guessedLetters.includes(letter)
                  ? word.includes(letter)
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-white/20"
              }`}
            >
              {letter}
            </span>
          ))}
        </div>

        {gameStatus !== "playing" && (
          <div className="text-lg font-semibold mb-4">
            {gameStatus === "won"
              ? "🎉 You Won!"
              : `❌ You Lost! Word was "${word}"`}
          </div>
        )}

        <button
          onClick={resetGame}
          className="px-4 py-2 bg-white/30 hover:bg-white/40 rounded shadow text-white font-semibold"
        >
          🔁 Restart
        </button>
      </div>
    </div>
  );
};

export default Hangman;
