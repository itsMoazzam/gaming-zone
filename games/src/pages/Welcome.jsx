import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="relative">
        {/* Outer spinning circle */}
        <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>

        {/* Center gaming icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl">
          🎮
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold animate-pulse">
          Loading...
        </div>

        {/* Floating particles */}
        <div className="absolute -top-4 -left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="absolute -top-2 -right-6 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute -bottom-2 -left-6 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700"></div>
      </div>
    </div>
  );
};

// Welcome Component
const Welcome = ({ onComplete }) => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [showPages, setShowPages] = useState(false);
  const message = "WELCOME TO GAMING ZONE";

  useEffect(() => {
    if (currentLetterIndex < message.length) {
      const timer = setTimeout(() => {
        setCurrentLetterIndex(currentLetterIndex + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      const showPagesTimer = setTimeout(() => {
        setShowPages(true);
      }, 1000);
      return () => clearTimeout(showPagesTimer);
    }
  }, [currentLetterIndex, message.length]);

  const getLetterColor = (index) => {
    const colors = [
      "text-red-400",
      "text-orange-400",
      "text-yellow-400",
      "text-green-400",
      "text-blue-400",
      "text-indigo-400",
      "text-purple-400",
      "text-pink-400"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Gaming icons floating around */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🕹️</div>
      <div className="absolute top-20 right-20 text-3xl animate-bounce delay-300">
        🎯
      </div>
      <div className="absolute bottom-20 left-20 text-4xl animate-bounce delay-500">
        ⭐
      </div>
      <div className="absolute bottom-10 right-10 text-3xl animate-bounce delay-700">
        🚀
      </div>
      <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-1000">
        💎
      </div>
      <div className="absolute top-1/3 right-5 text-2xl animate-bounce delay-1200">
        🏆
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Welcome message */}
        <div className="mb-12">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 h-20 sm:h-24 md:h-28 flex items-center justify-center flex-wrap gap-1 sm:gap-2">
            {message.split("").map((letter, index) => (
              <span
                key={index}
                className={`inline-block transform transition-all duration-500 ${
                  index < currentLetterIndex
                    ? `${getLetterColor(
                        index
                      )} scale-100 opacity-100 animate-pulse`
                    : "scale-0 opacity-0"
                } ${letter === " " ? "w-2 sm:w-4" : ""}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  textShadow: "0 0 20px currentColor"
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </div>

          {currentLetterIndex >= message.length && (
            <div className="text-lg sm:text-xl text-gray-300 animate-fade-in-up opacity-0 animation-delay-1000">
              Get ready for an amazing gaming experience!
            </div>
          )}
        </div>

        {/* Game selection buttons */}
        {showPages && (
          <div className="space-y-6 animate-fade-in-up opacity-0 animation-delay-2000">
            <h2 className="text-2xl sm:text-3xl text-white mb-8 font-semibold">
              Choose Your Adventure
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => onComplete("guess")}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 hover:shadow-2xl active:scale-95 min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">🔮</span>
                  <span>Guess Game</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => onComplete("puzzle")}
                className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white text-xl font-bold rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-green-500/50 hover:shadow-2xl active:scale-95 min-w-[200px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-teal-700 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">🧩</span>
                  <span>Puzzle Game</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center mt-8 space-x-4">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-ping delay-300"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping delay-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Game Pages Components
const GuessGame = ({ onBack }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
        <div className="text-6xl mb-4 animate-bounce">🔮</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Guess Game
        </h1>
        <p className="text-gray-300 mb-8">
          Welcome to the mysterious world of guessing! Test your intuition and
          unlock hidden secrets.
        </p>
        <div className="space-y-4">
          <button
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate("gaming-zone/guess/*")}
          >
            Start Guessing
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

const PuzzleGame = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
        <div className="text-6xl mb-4 animate-spin">🧩</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Puzzle Game
        </h1>
        <p className="text-gray-300 mb-8">
          Challenge your mind with intricate puzzles! Solve complex problems and
          sharpen your thinking skills.
        </p>
        <div className="space-y-4">
          <button
            className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate("gaming-zone/puzzle")}
          >
            Start Puzzle
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transform hover:scale-105 transition-all duration-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("loading");
  const navigate = useNavigate();
  useEffect(() => {
    // Show loading for 5 seconds
    const timer = setTimeout(() => {
      setCurrentPage("welcome");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handlePageSelection = (page) => {
    setCurrentPage(page);
  };

  const handleBackToWelcome = () => {
    setCurrentPage("welcome");
    navigate("/");
  };

  return (
    <div className="app">
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        @media (max-width: 640px) {
          .text-7xl {
            font-size: 3rem;
          }
          .text-6xl {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {currentPage === "loading" && <LoadingSpinner />}
      {currentPage === "welcome" && (
        <Welcome onComplete={handlePageSelection} />
      )}
      {currentPage === "guess" && <GuessGame onBack={handleBackToWelcome} />}
      {currentPage === "puzzle" && <PuzzleGame onBack={handleBackToWelcome} />}
    </div>
  );
};

export default App;
