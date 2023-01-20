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

  const lineLocal = (
    rowIdx: number,
    colIdx: number,
    symbol: string,
    updatedBoards: string[][],
    initResults: TotResults,
    move?: EnMove
  ): TotResults => {
    if (
      rowIdx < 0 ||
      colIdx < 0 ||
      rowIdx > updatedBoards.length - 1 ||
      colIdx > updatedBoards.length - 1
    ) {
      return initResults;
    }
    if (!updatedBoards[rowIdx][colIdx]) {
      return initResults;
    }
    if (updatedBoards[rowIdx][colIdx] !== symbol) {
      return initResults;
    }

    if (!move) {
      for (let key in ADJUSTMENT_OBJECT) {
        initResults = lineLocal(
          rowIdx + ADJUSTMENT_OBJECT[key as EnMove].row,
          colIdx + ADJUSTMENT_OBJECT[key as EnMove].col,
          symbol,
          updatedBoards,
          initResults,
          key as EnMove
        );
      }
    } else {
      initResults = lineLocal(
        rowIdx + ADJUSTMENT_OBJECT[move].row,
        colIdx + ADJUSTMENT_OBJECT[move].col,
        symbol,
        updatedBoards,
        initResults,
        move
      );

      if (move === EnMove.LEFT || move === EnMove.RIGHT) {
        initResults[EnResult.HORIZONTAL] = initResults[EnResult.HORIZONTAL] + 1;
      } else if (move === EnMove.BOTTOM || move === EnMove.TOP) {
        initResults[EnResult.VERTICAL] = initResults[EnResult.VERTICAL] + 1;
      } else if (
        move === EnMove.DIAGONAL_BOTTOM_LEFT ||
        move === EnMove.DIAGONAL_TOP_RIGHT
      ) {
        initResults[EnResult.DIAGONAL_RIGHT] =
          initResults[EnResult.DIAGONAL_RIGHT] + 1;
      } else if (
        move === EnMove.DIAGONAL_BOTTOM_RIGHT ||
        move === EnMove.DIAGONAL_TOP_LEFT
      ) {
        initResults[EnResult.DIAGONAL_LEFT] =
          initResults[EnResult.DIAGONAL_LEFT] + 1;
      }
    }
    return initResults;
  };

  const CompBestMove = useCallback(
    (
      boards: string[][],
      rowIdx: number,
      colIdx: number,
      isComputer: boolean
    ) => {
      const isTie = (boards: string[][]) => {
        for (let i = 0; i < boards.length; i++) {
          for (let j = 0; j < boards.length; j++) {
            if (!boards[i][j]) {
              return false;
            }
          }
        }
        return true;
      };

      const getWinner = (
        boards: string[][],
        rowIdx: number,
        colIdx: number
      ): boolean => {
        const initResults: TotResults = {
          [EnResult.HORIZONTAL]: 0,
          [EnResult.VERTICAL]: 0,
          [EnResult.DIAGONAL_LEFT]: 0,
          [EnResult.DIAGONAL_RIGHT]: 0,
        };

        const result = lineLocal(
          rowIdx,
          colIdx,
          boards[rowIdx][colIdx],
          boards,
          initResults
        );

        let isWin: boolean = false;
        for (let key in result) {
          if (result[key as EnResult] === MAX_SYMBOL) {
            isWin = true;
          }
        }
        return isWin;
      };

      const miniMax = (
        boards: string[][],
        rowIdx: number,
        colIdx: number,
        isMax: boolean,
        depth?: number
      ) => {
        const player = isMax ? "O" : "X";
        const isWin = getWinner(boards, rowIdx, colIdx);
        const best = {
          score: isMax ? -Infinity : Infinity,
          i: rowIdx,
          j: colIdx,
        };

        const nextDepth = depth ? depth - 1 : undefined;

        if (player === "X" && isWin) {
          return { score: 1, i: rowIdx, j: colIdx };
        }
        if (player === "O" && isWin) {
          return { score: -1, i: rowIdx, j: colIdx };
        }

        if (isTie(boards)) {
          return { score: 0, i: rowIdx, j: colIdx };
        }

        if (depth === 0) {
          return best;
        }

        for (let i = 0; i < boards.length; i++) {
          for (let j = 0; j < boards.length; j++) {
            if (boards[i][j]) {
              continue;
            }

            boards[i][j] = player;
            const score = miniMax(
              deepCopy(boards),
              i,
              j,
              !isMax,
              nextDepth
            ).score;
            boards[i][j] = "";

            if (isMax) {
              if (score > best.score) {
                best.score = score;
                best.i = i;
                best.j = j;
              }
            } else {
              if (score < best.score) {
                best.score = score;
                best.i = i;
                best.j = j;
              }
            }
          }
        }
        return best;
      };

      const depth = MAX_SYMBOL > 3 ? 3 : undefined;
      return miniMax(deepCopy(boards), rowIdx, colIdx, isComputer, depth);
    },
    []
  );

  const clickBoards = (rowIdx: number, colIdx: number) => {
    const newBoards = deepCopy(boards);
    if (isGameOver) {
      return;
    }

    if (newBoards[rowIdx][colIdx]) {
      return;
    }

    const initResults: TotResults = {
      [EnResult.HORIZONTAL]: 0,
      [EnResult.VERTICAL]: 0,
      [EnResult.DIAGONAL_LEFT]: 0,
      [EnResult.DIAGONAL_RIGHT]: 0,
    };

    if (isComputer) {
      newBoards[rowIdx][colIdx] = "X";
      const { i, j } = CompBestMove(newBoards, rowIdx, colIdx, true);

      if (i !== rowIdx || j !== colIdx) {
        newBoards[i][j] = "O";
        boardFilledCtr.current = boardFilledCtr.current + 1;
        const result = lineLocal(i, j, newBoards[i][j], newBoards, {
          ...initResults,
        });
        calculateGameStatus(result, isComputer);
      }
    } else {
      if (isFirstPlayer) {
        newBoards[rowIdx][colIdx] = "X";
      } else {
        newBoards[rowIdx][colIdx] = "O";
      }
      dispatch({ type: GameAction.SET_PLAYERS, payload: !isFirstPlayer });
    }

    dispatch({ type: GameAction.SET_BOARDS, payload: newBoards });

    boardFilledCtr.current = boardFilledCtr.current + 1;
    const result = lineLocal(
      rowIdx,
      colIdx,
      newBoards[rowIdx][colIdx],
      newBoards,
      { ...initResults }
    );
    calculateGameStatus(result, false);
  };

  const genCell = useCallback(
    (row: Array<string>, rowIdx: number): ReactNode => {
      return row.map((cell, idx) => {
        let content: ReactNode;
        if (cell === "X") {
          content = (
            <img src={close} width="32" height="32" alt="EX ICON"></img>
          );
        } else if (cell === "O") {
          content = (
            <img src={circle} width="32" height="32" alt="OH ICON"></img>
          );
        } else if (cell === "") {
          content = null;
        }

        return (
          <div className="cell" key={`cell-${rowIdx}-${idx}`}>
            <button
              type="button"
              onClick={() => clickBoards(rowIdx, idx)}
              disabled={isGameOver}
            >
              <span>{content}</span>
            </button>
          </div>
        );
      });
    },
    [boards, isGameOver]
  );

  const genBoard = useCallback((): ReactNode => {
    return boards.map((row, idx) => {
      return (
        <div className="row" key={`row-${idx}`}>
          {genCell(row, idx)}
        </div>
      );
    });
  }, [boards, genCell]);

  return <div className="App"></div>;
}
