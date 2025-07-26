import React from "react";
import { NavLink } from "react-router-dom";
const NavbarGuessGames = () => {
  return (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="" // Points to the index route
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="gaming zone"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Gaming Zone
          </span>
        </NavLink>

        {/* Mobile menu button... */}

        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <NavLink
                to="" // Points to index route
                end // Only active when exactly matched
                className={({ isActive }) =>
                  `block py-2 px-3 md:p-0 rounded-sm md:border-0 ${
                    isActive
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`
                }
              >
                Mystical Word
              </NavLink>
            </li>
            <li>
              <NavLink
                to="guess-game"
                className={({ isActive }) =>
                  `block py-2 px-3 md:p-0 rounded-sm md:border-0 ${
                    isActive
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`
                }
              >
                Guess Number
              </NavLink>
            </li>
            <li>
              <NavLink
                to="wordle-game"
                className={({ isActive }) =>
                  `block py-2 px-3 md:p-0 rounded-sm md:border-0 ${
                    isActive
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`
                }
              >
                Wordle
              </NavLink>
            </li>
            <li>
              <NavLink
                to="hangman-game"
                className={({ isActive }) =>
                  `block py-2 px-3 md:p-0 rounded-sm md:border-0 ${
                    isActive
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`
                }
              >
                Hangman
              </NavLink>
            </li>
            <li>
              <NavLink
                to="rock-paper-scissors-game"
                className={({ isActive }) =>
                  `block py-2 px-3 md:p-0 rounded-sm md:border-0 ${
                    isActive
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`
                }
              >
                RockPaperScissors
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default NavbarGuessGames;
