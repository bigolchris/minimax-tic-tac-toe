import { LOCAL_STORAGE_KEY } from "../constants/constant";
import { scoreStored } from "../types/types";

export const setLocalStorage = (storage: scoreStored) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
};

//deep copy//

export function deepCopy(array: string[][] | number[][] | boolean[][]) {
  let copy: any[][] = [];
  array.forEach((elem: any) => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem));
    } else {
      copy.push(elem);
    }
  });
  return copy;
}
