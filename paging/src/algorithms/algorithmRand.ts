import { PagingAlgorithm } from "../lib/algorithm";
import { count } from "../lib";

export const algorithmRand: PagingAlgorithm = config => {
  const memoryState: Array<number | null> = Object.seal(
    new Array(config.memorySize).fill(null)
  );

  const rows = config.inputTasks.map(({ pageNo }) => {
    if (-1 !== memoryState.indexOf(pageNo)) {
      return { memoryState: memoryState.slice(), hit: true };
    }

    const usedCells = count(memoryState);
    if (usedCells < memoryState.length) {
      memoryState[usedCells] = pageNo;
      return { memoryState: memoryState.slice(), hit: false };
    }

    const indexToOverride = Math.floor(Math.random() * memoryState.length);
    memoryState[indexToOverride] = pageNo;
    return { memoryState: memoryState.slice(), hit: false };
  });

  return { rows };
};
