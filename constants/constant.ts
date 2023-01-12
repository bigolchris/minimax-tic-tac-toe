import { GameState } from "../reduce/app";
import { EnMove, scoreStored } from "../types/types";
import { deepCopy } from "../utils/utils";

export const INIT_BOARD: GameState["boards"] = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
