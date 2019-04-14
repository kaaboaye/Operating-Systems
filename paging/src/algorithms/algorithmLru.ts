import { PagingAlgorithm } from "../lib/algorithm";
import { minBy } from "../lib";

export const algorithmLru: PagingAlgorithm = config => {
  const memoryState: Array<number | null> = Object.seal(
    new Array(config.memorySize).fill(null)
  );
  const memoryAgeMap = new Map<number, { idx: number; uses: number }>();

  const rows = config.inputTasks.map(({ pageNo }) => {
    if (memoryAgeMap.has(pageNo)) {
      memoryAgeMap.get(pageNo)!.uses++;
      return { memoryState: memoryState.slice(), hit: true };
    }

    if (memoryAgeMap.size < config.memorySize) {
      const idx = memoryAgeMap.size;
      memoryState[idx] = pageNo;
      memoryAgeMap.set(pageNo, { idx, uses: 1 });
      return { memoryState: memoryState.slice(), hit: false };
    }

    const { idx: indexToOverride } = minBy(
      [...memoryAgeMap.values()],
      ({ uses }) => uses
    );

    memoryAgeMap.delete(memoryState[indexToOverride]!);
    memoryState[indexToOverride] = pageNo;
    memoryAgeMap.set(pageNo, { idx: indexToOverride, uses: 1 });
    return { memoryState: memoryState.slice(), hit: false };
  });

  return { rows };
};
