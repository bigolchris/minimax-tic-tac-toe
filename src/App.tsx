import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";

import Reducer, { GameAction } from "../reduce/app";

import { EnMove, EnResult, TotResults } from "../types/types";

import {
  ADJUSTMENT_OBJECT,
  INIT_BOARD,
  INIT_GAME_STATE,
} from "../constants/constant";

import { deepCopy, setLocalStorage } from "../utils/utils";

import circle from "../img/circle.png";
import close from "../img/close.png";

function App() {
  const [state, dispatch] = useReducer(Reducer, INIT_GAME_STATE);
  const { isComputer, isFirstPlayer, isGameOver, boards, scores } = state;

  const MAX_SYMBOL = useMemo(() => boards.length, []);
  const boardFilledCtr = useRef<number>(0);

  const calculateGameStatus = (results: TotResults, isComputer: boolean) => {
    let isWin: boolean = false;

    for (let key in results) {
      if (results[key as EnResult] === MAX_SYMBOL) {
        isWin = true;
      }
    }
    const isComputerWin = isComputer && isWin;
    const isFirstPlayerWin = !isComputer && isFirstPlayer && isWin;
    const isSecondPlayerWin = !isFirstPlayer && isWin;
    const isTie: boolean =
      !isComputerWin &&
      !isFirstPlayerWin &&
      !isSecondPlayerWin &&
      boardFilledCtr.current === MAX_SYMBOL * MAX_SYMBOL;
    const isGameOver: boolean =
      isComputerWin || isFirstPlayerWin || isSecondPlayerWin || isTie;

    if (isGameOver) {
      scores.firstPlayer = isFirstPlayerWin
        ? scores.firstPlayer + 1
        : scores.firstPlayer;
      scores.secondPlayer = isSecondPlayerWin
        ? scores.secondPlayer + 1
        : scores.secondPlayer;
      scores.tie = isTie ? scores.tie + 1 : scores.tie;
      scores.computer = isComputerWin ? scores.computer + 1 : scores.computer;

      boardFilledCtr.current = 0;
      dispatch({ type: GameAction.SET_GAME_OVER, payload: isGameOver });
      dispatch({ type: GameAction.SET_SCORES, payload: scores });
      dispatch({ type: GameAction.SET_PLAYERS, payload: true });
      setLocalStorage(scores);
    }
  };
}
