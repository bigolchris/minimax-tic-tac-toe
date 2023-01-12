import { scoreStored } from "../types/types";
import { deepCopy } from "../utils/utils";

export enum GameAction {
  SET_BOARDS = "SET_BOARDS",
  SET_PLAYERS = "SET_PLAYER",
  SET_SCORES = "SET_SCORES",
  SET_GAME_OVER = "SET_GAME_OVER",
  IS_COMPUTER = "IS_COMPUTER",
}

export interface GameActionType {
  type: GameAction;
  payload:
    | GameState["boards"]
    | GameState["isFirstPlayer"]
    | GameState["isGameOver"]
    | GameState["scores"]
    | GameState["isComputer"];
}

export interface GameState {
  boards: Array<Array<string>>;
  isFirstPlayer: boolean;
  scores: scoreStored;
  isComputer: boolean;
  isGameOver: boolean;
}

const Reducer = (state: GameState, action: GameActionType) => {
  switch (action.type) {
    case GameAction.SET_BOARDS:
      const boards = action.payload as GameState["boards"];
      const newBoards = deepCopy(boards);
      return {
        ...state,
        boards: newBoards,
      };
    case GameAction.SET_PLAYERS:
      return {
        ...state,
        isFirstPlayer: action.payload as GameState["isFirstPlayer"],
      };
    case GameAction.SET_SCORES:
      return {
        ...state,
        scores: action.payload as GameState["scores"],
      };
    case GameAction.SET_GAME_OVER:
      return {
        ...state,
        isGameOver: action.payload as GameState["isGameOver"],
      };
    case GameAction.IS_COMPUTER:
      return {
        ...state,
        isComputer: action.payload as GameState["isComputer"],
      };
    default:
      return state;
  }
};

export default Reducer;
