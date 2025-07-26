import React, { useState, useEffect } from "react";

const choices = [
  { name: "Rock", emoji: "🪨", color: "bg-gray-400" },
  { name: "Paper", emoji: "📄", color: "bg-blue-200" },
  { name: "Scissors", emoji: "✂️", color: "bg-red-300" }
];

const getResult = (player, computer) => {
  if (player === computer) return "draw";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  )
    return "win";
  return "lose";
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [fighting, setFighting] = useState(false);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem("rpsScore"));
    if (!isNaN(saved)) setScore(saved);
  }, []);

  const handleClick = (choice) => {
    setFighting(true);
    const computer = choices[Math.floor(Math.random() * 3)];
    const outcome = getResult(choice.name, computer.name);

    setTimeout(() => {
      setPlayerChoice(choice);
      setComputerChoice(computer);
      setResult(outcome);

      const newScore =
        outcome === "win" ? score + 1 : outcome === "lose" ? score - 1 : score;
      setScore(newScore);
      localStorage.setItem("rpsScore", newScore);
      setFighting(false);
    }, 1200);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans px-4 relative overflow-hidden">
      {/* Floating animated shapes in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-16 h-16 bg-transparent border-2 border-white/10 rounded-full animate-float1"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-transparent border-2 border-white/10 rounded-lg animate-float2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-transparent border-2 border-white/10 rounded-full animate-float3"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-transparent border-2 border-white/10 animate-float4"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-transparent border-2 border-white/10 rounded-lg animate-float5"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-700">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Rock Paper Scissors
        </h1>

        <div className="flex flex-col items-center">
          {/* Score display */}
          <div className="mb-8 px-6 py-3 bg-gray-700 rounded-full shadow-lg">
            <p className="text-lg font-medium">
              🏆 Score:{" "}
              <span className="font-bold text-yellow-400">{score}</span>
            </p>
          </div>

          {/* Game area */}
          <div className="flex justify-center items-center gap-8 mb-10 w-full">
            <div className="text-center flex-1">
              <p className="mb-4 font-medium text-gray-300">You</p>
              <div
                className={`mx-auto w-32 h-32 ${
                  playerChoice?.color || "bg-gray-700"
                } rounded-full flex items-center justify-center text-6xl transition-all duration-500 shadow-lg ${
                  fighting && "animate-pulse"
                }`}
              >
                {playerChoice?.emoji || "❔"}
              </div>
            </div>

            <div
              className={`text-5xl ${
                fighting ? "animate-spin" : "animate-bounce"
              }`}
            >
              ⚡
            </div>

            <div className="text-center flex-1">
              <p className="mb-4 font-medium text-gray-300">Computer</p>
              <div
                className={`mx-auto w-32 h-32 ${
                  computerChoice?.color || "bg-gray-700"
                } rounded-full flex items-center justify-center text-6xl transition-all duration-500 shadow-lg ${
                  fighting && "animate-pulse"
                }`}
              >
                {computerChoice?.emoji || "❔"}
              </div>
            </div>
          </div>

          {/* Choices */}
          <div className="flex gap-6 mb-8 flex-wrap justify-center">
            {choices.map((choice) => (
              <button
                key={choice.name}
                onClick={() => handleClick(choice)}
                disabled={fighting}
                className={`px-6 py-4 ${
                  choice.color
                } hover:opacity-90 text-gray-900 font-semibold rounded-xl text-xl shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  fighting && "opacity-50 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl">{choice.emoji}</span> {choice.name}
              </button>
            ))}
          </div>

          {/* Result */}
          {result && (
            <div className="text-center mb-6 animate-fade-in-up">
              <p
                className={`text-2xl font-bold mb-4 ${
                  result === "win"
                    ? "text-green-400"
                    : result === "lose"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {result === "win" && "🎉 You Won!"}
                {result === "lose" && "💥 You Lost!"}
                {result === "draw" && "🤝 It's a Draw!"}
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
              >
                🔁 Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(10px, 20px) rotate(5deg);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-15px, 10px) rotate(-5deg);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(5px, -15px) scale(1.1);
          }
        }
        @keyframes float4 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, 5px) rotate(10deg);
          }
        }
        @keyframes float5 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-10px, 15px) scale(0.9);
          }
        }
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
        .animate-float4 {
          animation: float4 9s ease-in-out infinite;
        }
        .animate-float5 {
          animation: float5 11s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RockPaperScissors;
