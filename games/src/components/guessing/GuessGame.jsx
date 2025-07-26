import React, { useState, useEffect, useCallback, memo } from "react";

// Animated Button Component
const AnimatedButton = memo(
  ({ onClick, className, children, disabled = false }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${className} transform transition-all duration-150 hover:scale-105 active:scale-95 ${
          isPressed ? "animate-pulse" : ""
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        {children}
      </button>
    );
  }
);

// History Item Component
const HistoryItem = memo(({ record, index }) => (
  <div
    className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-lg border border-white border-opacity-30 transform transition-all duration-300 hover:scale-102 hover:bg-opacity-30"
    style={{
      animationDelay: `${index * 100}ms`,
      animation: "slideInFromRight 0.5s ease-out forwards"
    }}
  >
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{record.date}</span>
      <span className="bg-blue-500 bg-opacity-80 px-2 py-1 rounded-full text-xs font-bold">
        {record.attempts} tries
      </span>
    </div>
  </div>
));

// Message Component with animations
const GameMessage = memo(({ message, type }) => {
  if (!message) return null;

  const getMessageStyle = () => {
    switch (type) {
      case "success":
        return "text-white-400 animate-bounce bg-green-500 bg-opacity-20 border-green-400";
      case "error":
        return "text-whiite-400 animate-shake bg-red-500 bg-opacity-20 border-red-400";
      case "hint":
        return "text-white-400 animate-pulse bg-yellow-500 bg-opacity-20 border-yellow-400";
      default:
        return "text-white bg-white bg-opacity-10 border-white border-opacity-30";
    }
  };

  return (
    <div
      className={`mt-6 p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-500 ${getMessageStyle()}`}
    >
      <p className="text-center text-lg font-semibold">{message}</p>
    </div>
  );
});

const GuessGame = () => {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const resetGame = useCallback(() => {
    setTarget(Math.floor(Math.random() * 50) + 1);
    setGuess("");
    setMessage("");
    setMessageType("");
    setAttempts(0);
    setIsGameWon(false);
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleGuess = useCallback(() => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 50) {
      setMessage("❌ Please enter a valid number between 1-50");
      setMessageType("error");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (num === target) {
      const newRecord = {
        date: new Date().toLocaleString(),
        attempts: newAttempts
      };
      setHistory((prev) => [newRecord, ...prev]);
      setMessage(
        `🎉 Congratulations! You guessed ${target} in ${newAttempts} tries!`
      );
      setMessageType("success");
      setIsGameWon(true);
      setShowConfetti(true);

      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (num < target) {
      setMessage(`🔼 Too low! Try a higher number (Attempt ${newAttempts})`);
      setMessageType("hint");
    } else {
      setMessage(`🔽 Too high! Try a lower number (Attempt ${newAttempts})`);
      setMessageType("hint");
    }
  }, [guess, target, attempts]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !isGameWon) {
        handleGuess();
      }
    },
    [handleGuess, isGameWon]
  );

  return (
    <>
      <style jsx global>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-3px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(3px);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #f0f;
          animation: confetti 3s linear infinite;
        }

        .confetti:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
          background: #ff6b6b;
        }
        .confetti:nth-child(2) {
          left: 20%;
          animation-delay: 0.2s;
          background: #4ecdc4;
        }
        .confetti:nth-child(3) {
          left: 30%;
          animation-delay: 0.4s;
          background: #45b7d1;
        }
        .confetti:nth-child(4) {
          left: 40%;
          animation-delay: 0.6s;
          background: #96ceb4;
        }
        .confetti:nth-child(5) {
          left: 50%;
          animation-delay: 0.8s;
          background: #feca57;
        }
        .confetti:nth-child(6) {
          left: 60%;
          animation-delay: 1s;
          background: #ff9ff3;
        }
        .confetti:nth-child(7) {
          left: 70%;
          animation-delay: 1.2s;
          background: #54a0ff;
        }
        .confetti:nth-child(8) {
          left: 80%;
          animation-delay: 1.4s;
          background: #5f27cd;
        }
        .confetti:nth-child(9) {
          left: 90%;
          animation-delay: 1.6s;
          background: #00d2d3;
        }

        .game-container {
          background: linear-gradient(
            -45deg,
            #667eea,
            #764ba2,
            #f093fb,
            #f5576c,
            #4facfe,
            #00f2fe
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .game-container::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          animation: rotate 20s linear infinite;
        }

        .game-container::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(
              circle at 20% 50%,
              rgba(120, 119, 198, 0.3) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(255, 119, 198, 0.3) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 40% 80%,
              rgba(120, 219, 255, 0.3) 0%,
              transparent 50%
            );
          animation: floatBubbles 25s ease-in-out infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes floatBubbles {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.7;
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.4;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.8;
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .glass-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          border-radius: inherit;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .number-input {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }

        .number-input:focus {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.02);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes geometricFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(20px) rotate(90deg)
              scale(1.2);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) translateX(-15px) rotate(180deg)
              scale(0.8);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-25px) translateX(10px) rotate(270deg)
              scale(1.1);
            opacity: 0.7;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div className="min-h-screen game-container text-white flex flex-col items-center justify-center p-4 relative">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="confetti"></div>
            ))}
          </div>
        )}

        <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-md mx-4 transform transition-all duration-500 hover:scale-105 relative z-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              🎯 Guess the Number
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Pick a number between 1-50
            </p>
            {attempts > 0 && !isGameWon && (
              <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-blue-300">
                Attempts: {attempts}
              </p>
            )}
          </div>

          {/* Input Section */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="number"
                min="1"
                max="50"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isGameWon}
                className="number-input rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-black text-lg sm:text-xl font-semibold border-0 focus:outline-none w-full placeholder-gray-500"
                placeholder="Enter your guess..."
              />
              <AnimatedButton
                onClick={handleGuess}
                disabled={isGameWon}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg"
              >
                <span className="text-sm sm:text-base">🚀 Guess</span>
              </AnimatedButton>
            </div>
          </div>

          {/* Message Display */}
          <GameMessage message={message} type={messageType} />

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 gap-3 sm:gap-4">
            <AnimatedButton
              onClick={resetGame}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg"
            >
              <span className="text-sm sm:text-base">🔄 New Game</span>
            </AnimatedButton>
            {history.length > 0 && (
              <AnimatedButton
                onClick={clearHistory}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg"
              >
                <span className="text-sm sm:text-base">🗑️ Clear History</span>
              </AnimatedButton>
            )}
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🏆 Game History
              </h2>
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto custom-scrollbar text-gray-300">
                {history.slice(0, 10).map((record, index) => (
                  <HistoryItem key={index} record={record} index={index} />
                ))}
              </div>
              {history.length > 10 && (
                <p className="text-center text-xs sm:text-sm mt-1 sm:mt-2 opacity-70">
                  Showing latest 10 games
                </p>
              )}
            </div>
          )}
        </div>

        {/* Floating particles for extra visual appeal */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                background: `hsla(${Math.random() * 360}, 70%, 70%, 0.6)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Animated geometric shapes */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={`shape-${i}`}
              className="absolute"
              style={{
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                background: `linear-gradient(45deg, hsla(${
                  Math.random() * 360
                }, 60%, 60%, 0.2), hsla(${
                  Math.random() * 360
                }, 60%, 60%, 0.1))`,
                borderRadius: Math.random() > 0.5 ? "50%" : "10%",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `geometricFloat ${
                  5 + Math.random() * 8
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GuessGame;
