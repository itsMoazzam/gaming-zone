import React, { useState, useEffect } from "react";
import words from "../../data/words";

// Filter word list to only include 5-letter words
const fiveLetterWords = words.filter((word) => word.length === 5);
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const getRandomWord = () => {
  const randomWord =
    fiveLetterWords[
      Math.floor(Math.random() * fiveLetterWords.length)
    ].toUpperCase();
  return randomWord;
};

const evaluateGuess = (guess, target) => {
  return guess.split("").map((letter, i) => {
    if (letter === target[i]) return "correct";
    if (target.includes(letter)) return "present";
    return "absent";
  });
};

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [result, setResult] = useState("");
  const [shakeRow, setShakeRow] = useState(-1);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintLetter, setHintLetter] = useState({ letter: "", position: -1 });

  // Generate hint when component mounts
  const generateHint = React.useCallback(() => {
    if (hintUsed) return;

    // Find a random position in the target word that hasn't been guessed yet
    const positions = Array.from({ length: WORD_LENGTH }, (_, i) => i);
    const shuffledPositions = positions.sort(() => 0.5 - Math.random());

    for (const pos of shuffledPositions) {
      const letter = targetWord[pos];
      setHintLetter({ letter, position: pos });
      break;
    }
  }, [hintUsed, targetWord]);

  useEffect(() => {
    generateHint();
  }, [targetWord, generateHint]);

  const useHint = () => {
    if (hintUsed || !hintLetter.letter) return;

    // Fill the current guess with the hint letter if empty at that position
    let newGuess = currentGuess.split("");
    if (
      newGuess.length <= hintLetter.position ||
      newGuess[hintLetter.position] !== hintLetter.letter
    ) {
      newGuess[hintLetter.position] = hintLetter.letter;
      setCurrentGuess(newGuess.join("").substring(0, WORD_LENGTH));
    }

    setHintUsed(true);
  };

  const handleKeyDown = (e) => {
    if (result) return;

    if (e.key === "Enter" && currentGuess.length === WORD_LENGTH) {
      const guess = currentGuess.toUpperCase();

      // Check if word is valid
      if (!fiveLetterWords.includes(guess.toLowerCase())) {
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(-1), 500);
        return;
      }

      const feedback = evaluateGuess(guess, targetWord);
      const newGuesses = [...guesses, { guess, feedback }];

      setGuesses(newGuesses);
      setCurrentGuess("");

      if (guess === targetWord) {
        setResult("success");
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setResult("failure");
      }
    } else if (e.key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + e.key.toUpperCase());
    }
  };

  const resetGame = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setResult("");
    setHintUsed(false);
    generateHint();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Create stars for background
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.5,
    delay: Math.random() * 5
  }));

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center text-white font-mono bg-gray-900">
      {/* Space background with twinkling stars */}
      {console.log(targetWord)}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${5 + star.delay}s infinite alternate`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 w-[90%] max-w-md shadow-2xl z-10 border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          COSMIC WORDLE
        </h1>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Attempts: {guesses.length}/{MAX_ATTEMPTS}
          </div>
          <button
            onClick={useHint}
            disabled={hintUsed || result}
            className={`px-3 py-1 text-sm rounded-md ${
              hintUsed
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            } transition-colors`}
          >
            {hintUsed ? "Hint Used" : "Get Hint"}
          </button>
        </div>

        {hintLetter.position !== -1 && !hintUsed && !result && (
          <div className="text-center text-sm text-amber-300 mb-3 animate-pulse">
            Hint: Letter <span className="font-bold">{hintLetter.letter}</span>{" "}
            is at position {hintLetter.position + 1}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
            const row = guesses[i];
            const letters = row?.guess.split("") || currentGuess.split("");
            const isShaking = shakeRow === i;

            return (
              <div
                key={i}
                className={`flex gap-2 justify-center ${
                  isShaking ? "animate-shake" : ""
                }`}
              >
                {Array.from({ length: WORD_LENGTH }).map((_, j) => {
                  const char = letters[j] || "";
                  const status = row?.feedback?.[j] || "";
                  const isHintPosition = hintLetter.position === j && hintUsed;
                  const bgColor =
                    {
                      correct:
                        "bg-gradient-to-br from-green-400 to-emerald-600",
                      present: "bg-gradient-to-br from-yellow-400 to-amber-600",
                      absent: "bg-gray-700"
                    }[status] ||
                    (isHintPosition ? "bg-blue-600" : "bg-gray-700/50");

                  return (
                    <div
                      key={j}
                      className={`w-12 h-12 text-2xl flex items-center justify-center rounded-md font-bold ${bgColor} 
                        ${status === "correct" ? "animate-pop" : ""}
                        ${status ? "text-white" : "text-gray-300"}
                        border ${
                          status ? "border-transparent" : "border-gray-600"
                        }
                        shadow-md relative`}
                    >
                      {char}
                      {isHintPosition && !status && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {result === "success" && (
          <div className="animate-fade-in mb-4 text-center">
            <div className="animate-confetti py-4">
              <p className="text-2xl font-bold text-green-400 mb-2">SUCCESS!</p>
              <p className="text-lg">You've solved the cosmic puzzle!</p>
              <div className="mt-3 flex justify-center space-x-2">
                {targetWord.split("").map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 flex items-center justify-center bg-green-500 rounded-md animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {result === "failure" && (
          <div className="animate-fade-in mb-4 text-center">
            <p className="text-2xl font-bold text-red-400 mb-1">GAME OVER</p>
            <p className="text-lg">The word was</p>
            <div className="mt-2 flex justify-center space-x-2">
              {targetWord.split("").map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-md animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg shadow-lg font-medium transition-all hover:scale-105 active:scale-95"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Add CSS animations in your global CSS file */}
      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes confetti {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        .animate-pop {
          animation: pop 0.3s ease;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-confetti {
          animation: confetti 0.5s ease-out;
        }
        .animate-bounce {
          animation: bounce 0.5s ease infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default WordleGame;
