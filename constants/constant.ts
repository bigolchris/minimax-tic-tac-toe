import { GameState } from "../reduce/app";
import { EnMove, scoreStored } from "../types/types";
import { deepCopy } from "../utils/utils";

export const ADJUSTMENT_OBJECT: Record<EnMove, { row: number; col: number }> = {
  [EnMove.LEFT]: { row: 0, col: -1 },
  [EnMove.RIGHT]: { row: 0, col: 1 },
  [EnMove.TOP]: { row: -1, col: 0 },
  [EnMove.BOTTOM]: { row: 1, col: 0 },
  [EnMove.DIAGONAL_BOTTOM_LEFT]: { row: 1, col: -1 },
  [EnMove.DIAGONAL_BOTTOM_RIGHT]: { row: 1, col: 1 },
  [EnMove.DIAGONAL_TOP_LEFT]: { row: -1, col: -1 },
  [EnMove.DIAGONAL_TOP_RIGHT]: { row: -1, col: 1 },
};

export const LOCAL_STORAGE_KEY = "tic-tac-toe";

export const SCORES = (() => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    return {
      firstPlayer: 0,
      secondPlayer: 0,
      tie: 0,
      computer: 0,
    } as scoreStored;
  }
  return JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
  ) as scoreStored;
})();

export const INIT_BOARD: GameState["boards"] = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export const INIT_GAME_STATE: GameState = {
  boards: deepCopy(INIT_BOARD),
  isFirstPlayer: true,
  isComputer: false,
  isGameOver: false,
  scores: SCORES,
};
