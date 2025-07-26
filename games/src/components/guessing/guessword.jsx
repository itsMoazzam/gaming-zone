import React, { useState, useEffect } from "react";
import words from "../../data/words";
// Mock words data - replace with your actual words import

const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)].toLowerCase();
};

const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const GuessCircleWord = () => {
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState("");
  const [shuffledLetters, setShuffledLetters] = useState(
    shuffle(targetWord.split(""))
  );
  const [isAnimating, setIsAnimating] = useState(true);
  const [showHint, setShowHint] = useState(false);

  const letters = targetWord.split("");

  // Calculate responsive dimensions
  const [dimensions, setDimensions] = useState({
    containerSize: Math.min(window.innerWidth * 0.9, 500),
    center: Math.min(window.innerWidth * 0.9, 500) / 2,
    radius: Math.min(window.innerWidth * 0.9, 500) * 0.4,
    letterSize: Math.min(window.innerWidth * 0.9, 500) * 0.15,
    wordDisplayWidth: Math.min(window.innerWidth * 0.9, 500) * 0.6
  });

  useEffect(() => {
    const handleResize = () => {
      const containerSize = Math.min(window.innerWidth * 0.9, 500);
      setDimensions({
        containerSize,
        center: containerSize / 2,
        radius: containerSize * 0.4,
        letterSize: containerSize * 0.15,
        wordDisplayWidth: containerSize * 0.6
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLetterClick = (char, idx) => {
    if (
      selected.length < letters.length &&
      !selected.includes(idx) &&
      !result &&
      !isAnimating
    ) {
      setSelected([...selected, idx]);
    }
  };

  const handleReset = () => {
    setIsAnimating(true);
    setResult("");
    setSelected([]);
    setShowHint(false);

    setTimeout(() => {
      const newWord = getRandomWord();
      setTargetWord(newWord);
      setShuffledLetters(shuffle(newWord.split("")));

      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 300);
  };

  const handleHint = () => {
    if (!result && !isAnimating) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAnimating || !!result) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key.length === 1 && key.match(/[a-z]/)) {
        const idx = shuffledLetters.findIndex(
          (char, i) => char === key && !selected.includes(i)
        );
        if (idx !== -1 && selected.length < letters.length) {
          setSelected((prev) => [...prev, idx]);
        }
      }
      if (key === "backspace" && selected.length > 0) {
        setSelected((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shuffledLetters, selected, isAnimating, result, letters.length]);

  useEffect(() => {
    if (selected.length === letters.length && !isAnimating) {
      const guess = selected.map((i) => shuffledLetters[i]).join("");

      if (guess.toLowerCase() === targetWord.toLowerCase()) {
        setResult("🎉 Perfect! You found the word!");
      } else {
        setResult("❌ Not quite right! Try again!");
        setTimeout(() => {
          setResult("");
          setSelected([]);
        }, 1500);
      }
    }
  }, [selected, targetWord, letters, shuffledLetters, isAnimating]);

  const angleStep = (2 * Math.PI) / letters.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden px-4 py-8">
      {/* Animated background with particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 40 + 10}px`,
              height: `${Math.random() * 40 + 10}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 10}s`
            }}
          />
        ))}

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-indigo-500/25 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header section */}
      <div className="text-center mb-4 md:mb-8 z-10 relative w-full">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent animate-glow">
          ✨ Mystical Word Circle ✨
        </h1>
      </div>

      {/* Main game circle */}
      <div
        className="relative mb-4 md:mb-8 z-10"
        style={{
          width: `${dimensions.containerSize}px`,
          height: `${dimensions.containerSize}px`
        }}
      >
        {/* Multiple glow layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-pink-500/40 to-indigo-600/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Main circle with enhanced 3D effect */}
        <svg
          width={dimensions.containerSize}
          height={dimensions.containerSize}
          className="relative"
        >
          <defs>
            <linearGradient
              id="circleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient
              id="borderGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter
              id="innerShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="#000000"
                floodOpacity="0.3"
              />
            </filter>
          </defs>
          <circle
            cx={dimensions.center}
            cy={dimensions.center}
            r={dimensions.radius + 2}
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="4"
            className="animate-spin-slow"
          />
          <circle
            cx={dimensions.center}
            cy={dimensions.center}
            r={dimensions.radius}
            fill="url(#circleGradient)"
            stroke="url(#borderGradient)"
            strokeWidth="2"
            filter="url(#innerShadow)"
            className="backdrop-blur-sm"
          />
        </svg>

        {/* Letters around the circle */}
        {shuffledLetters.map((char, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x =
            dimensions.center +
            dimensions.radius * Math.cos(angle) -
            dimensions.letterSize / 2;
          const y =
            dimensions.center +
            dimensions.radius * Math.sin(angle) -
            dimensions.letterSize / 2;
          const isUsed = selected.includes(i);

          return (
            <button
              key={`${targetWord}-${i}`}
              className={`absolute font-bold transition-all duration-700 transform shadow-2xl
                ${
                  isUsed
                    ? "bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 text-white cursor-not-allowed scale-75 opacity-60 rotate-12"
                    : "bg-gradient-to-br from-white via-purple-50 to-pink-50 text-purple-800 hover:from-purple-100 hover:via-pink-100 hover:to-indigo-100 hover:scale-125 hover:shadow-purple-500/50 hover:-translate-y-2 active:scale-110"
                }
                ${isAnimating ? "animate-bounce-in scale-0" : "scale-100"}
                ${showHint && !isUsed ? "animate-wiggle" : ""}
                border-2 border-purple-300/50 rounded-2xl backdrop-blur-sm hover:border-purple-400`}
              style={{
                left: x,
                top: y,
                width: `${dimensions.letterSize}px`,
                height: `${dimensions.letterSize}px`,
                fontSize: `${dimensions.letterSize * 0.4}px`,
                animationDelay: isAnimating ? `${i * 200}ms` : "0ms",
                animationDuration: isAnimating ? "1200ms" : "0ms",
                animationFillMode: "forwards"
              }}
              disabled={isUsed || !!result || isAnimating}
              onClick={() => handleLetterClick(char, i)}
            >
              <span className="drop-shadow-sm relative z-10">
                {char.toUpperCase()}
              </span>
              {!isUsed && !isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          );
        })}

        {/* Word display area with enhanced styling */}
        <div
          className="absolute flex justify-center items-center gap-1 md:gap-2 z-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 p-2 md:p-4 shadow-2xl"
          style={{
            left: dimensions.center - dimensions.wordDisplayWidth / 2,
            top: dimensions.center - dimensions.letterSize / 2,
            width: `${dimensions.wordDisplayWidth}px`,
            height: `${dimensions.letterSize}px`
          }}
        >
          {Array.from({ length: letters.length }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-center rounded-xl transition-all duration-500 transform relative overflow-hidden
                ${
                  selected[i] !== undefined
                    ? "bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white shadow-lg scale-110 animate-letter-glow"
                    : "bg-white/60 text-purple-400 border-2 border-dashed border-purple-300/60 hover:bg-white/80"
                }`}
              style={{
                width: `${dimensions.letterSize * 0.7}px`,
                height: `${dimensions.letterSize * 0.8}px`,
                fontSize: `${dimensions.letterSize * 0.4}px`
              }}
            >
              {selected[i] !== undefined && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 animate-pulse"></div>
              )}
              <span className="relative z-10">
                {selected[i] !== undefined
                  ? shuffledLetters[selected[i]].toUpperCase()
                  : ""}
              </span>
            </div>
          ))}
        </div>

        {/* Coin animation for correct answer */}
        {result === "🎉 Perfect! You found the word!" && (
          <div className="pointer-events-none absolute inset-0 flex justify-center items-start z-40">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2"
                style={{
                  transform: `translateX(-50%)`,
                  top: 0,
                  animation: `coin-drop 1s ${
                    i * 0.15
                  }s cubic-bezier(.17,.67,.83,.67) forwards`
                }}
              >
                <span className="inline-block text-yellow-400 text-2xl md:text-4xl drop-shadow-lg">
                  🪙
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced result overlay */}
        {result && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/95 via-purple-50/95 to-pink-50/95 rounded-full backdrop-blur-md z-30 animate-result-appear border-4 border-purple-300/50">
            <div className="text-center animate-bounce-in-result px-4">
              <div className="text-4xl md:text-6xl mb-2 md:mb-4 animate-spin-once">
                {result.includes("Perfect") ? "🎉" : "❌"}
              </div>
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
                {result.replace("🎉 ", "").replace("❌ ", "")}
              </div>
              {result.includes("Perfect") && (
                <div className="text-xs md:text-sm text-purple-600 mt-1 md:mt-2 animate-pulse">
                  +{letters.length * 10} points!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 md:mb-6 z-10 w-full max-w-md px-4">
        <button
          onClick={handleReset}
          disabled={isAnimating}
          className={`px-4 py-3 md:px-8 md:py-4 font-bold text-base md:text-lg rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl relative overflow-hidden
            ${
              isAnimating
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-purple-500/50 hover:shadow-purple-500/70"
            }`}
        >
          {isAnimating && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isAnimating ? (
              <>
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Conjuring...
              </>
            ) : (
              "🎲 New Word"
            )}
          </span>
        </button>

        <button
          onClick={handleHint}
          disabled={isAnimating || !!result}
          className="px-4 py-3 md:px-6 md:py-4 font-bold text-base md:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl md:rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💡 Hint
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center w-full max-w-2xl text-white/80 bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl z-10 mx-4">
        <p className="text-sm md:text-lg leading-relaxed">🌟Hint✨</p>
        {showHint && (
          <p className="mt-2 md:mt-4 text-yellow-300 font-semibold animate-pulse text-sm md:text-base">
            💫 Hint: The word is "{targetWord.toUpperCase()}" 💫
          </p>
        )}
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            text-shadow: 0 0 40px rgba(236, 72, 153, 0.8),
              0 0 60px rgba(168, 85, 247, 0.6);
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(-90deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-3deg) scale(1.05);
          }
          75% {
            transform: rotate(3deg) scale(1.05);
          }
        }
        @keyframes letter-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.8);
          }
        }
        @keyframes result-appear {
          0% {
            transform: scale(0.5) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(5deg);
            opacity: 0.9;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes bounce-in-result {
          0% {
            transform: scale(0.3) translateY(30px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) translateY(-10px);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) translateY(0px);
            opacity: 1;
          }
        }
        @keyframes spin-once {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes coin-drop {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-40px) scale(0.5)
              rotate(-30deg);
          }
          40% {
            opacity: 1;
          }
          80% {
            transform: translateX(-50%) translateY(220px) scale(1.1)
              rotate(20deg);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(260px) scale(1) rotate(0deg);
          }
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounce-in ease-out forwards;
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out 3;
        }
        .animate-letter-glow {
          animation: letter-glow 2s ease-in-out infinite;
        }
        .animate-result-appear {
          animation: result-appear 0.6s ease-out forwards;
        }
        .animate-bounce-in-result {
          animation: bounce-in-result 0.8s ease-out forwards;
        }
        .animate-spin-once {
          animation: spin-once 0.6s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GuessCircleWord;
