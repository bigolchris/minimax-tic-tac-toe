export enum EnMove {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  DIAGONAL_TOP_LEFT = "DIAGONAL_TOP_LEFT",
  DIAGONAL_TOP_RIGHT = "DIAGONAL_TOP_RIGHT",
  DIAGONAL_BOTTOM_LEFT = "DIAGONAL_BOTTOM_LEFT",
  DIAGONAL_BOTTOM_RIGHT = "DIAGONAL_BOTTOM_RIGHT",
}

export enum EnResult {
  VERTICAL = "VERTICAL",
  HORIZONTAL = "HORIZONTAL",
  DIAGONAL_LEFT = "DIAGONAL_LEFT",
  DIAGONAL_RIGHT = "DIAGONAL_RIGHT",
}

export type TotResults = Record<EnResult, number>;

export interface scoreStored {
  firstPlayer: number;
  secondPlayer: number;
  computer: number;
  tie: number;
}
