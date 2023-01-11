import { scoreStored } from "../types/types";
import { deepCopy } from "../utils/utils";


export enum GameAction {
    SET_BOARDS = 'SET_BOARDS',
    SET_PLAYERS = 'SET_PLAYER',
    SET_SCORES = 'SET_SCORES',
    SET_GAME_OVER = 'SET_GAME_OVER',
    IS_COMPUTER = 'IS_COMPUTER',
}

export interface GameActionType {
    type: GameAction;
    payload: | GameActionType['boards']
}

export interface GameState {
    boards: Array<Array<string>>;
    isFirstPlayer: boolean;
    scores: scoreStored;
    isComputer:boolean ;
    isGameOver: boolean;


// const Reducer = (state: gameState, action: GameActionType) => {