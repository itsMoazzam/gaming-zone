import GuessGame from "../components/guessing/GuessGame";
import WordleGame from "../components/guessing/WordleGame";
import Hangman from "../components/guessing/HangMan";
import RockPaperScissors from "../components/guessing/RockPaperScissors";
import { Route, Routes } from "react-router-dom";
import NavbarGuessGames from "../components/guessing/NavbarGuessGames";
import GuessWordGame from "../components/guessing/guessword";

const Guess = () => {
  return (
    <>
      <NavbarGuessGames />
      <Routes>
        <Route index element={<GuessWordGame />} />
        <Route path="guess-game" element={<GuessGame />} />
        <Route path="wordle-game" element={<WordleGame />} />
        <Route path="hangman-game" element={<Hangman />} />
        <Route
          path="rock-paper-scissors-game"
          element={<RockPaperScissors />}
        />
      </Routes>
    </>
  );
};

export default Guess;
