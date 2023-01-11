import React from "react";

const minimax = (
  boards: string[][],
  row: number,
  col: number,
  isMaximized: boolean,
  depth?: number
) => {
  const player = isMaximized ? "X" : "O";
  const win = checkWin(boards, row, col, player);

  const bestPlay = {
    score: isMaximized ? -Infinity : Infinity,
    i: row,
    j: col,
  };
};
