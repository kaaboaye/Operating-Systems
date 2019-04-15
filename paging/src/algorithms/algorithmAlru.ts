import { PagingAlgorithm } from "../lib/algorithm";
import { minBy } from "../lib";

export const algorithmAlru: PagingAlgorithm = config => {
  const memoryState: Array<number | null> = Object.seal(
    new Array(config.memorySize).fill(null)
  );
  const memoryPagesSet: Map<number, number> = new Map();
  const memoryUsedPagesSet: Set<number> = new Set();

  const rows = config.inputTasks.map(({ pageNo }) => {
    if (memoryPagesSet.has(pageNo)) {
      memoryUsedPagesSet.add(pageNo);
      return { memoryState: memoryState.slice(), hit: true };
    }

    if (memoryPagesSet.size < config.memorySize) {
      const idx = memoryPagesSet.size;
      memoryState[idx] = pageNo;
      memoryPagesSet.set(pageNo, idx);
      return { memoryState: memoryState.slice(), hit: false };
    }

    const [pageToOverride, indexToOverride] = (() => {
      const pageToOverride = [...memoryPagesSet.keys()].find(
        p => !memoryUsedPagesSet.has(p)
      );

      if (pageToOverride !== undefined) {
        return [pageToOverride, memoryPagesSet.get(pageToOverride)!];
      } else {
        const res = memoryPagesSet.entries().next().value;
        memoryUsedPagesSet.delete(res[0]);
        return res;
      }
    })();

    memoryPagesSet.delete(pageToOverride!);
    memoryState[indexToOverride] = pageNo;
    memoryPagesSet.set(pageNo, indexToOverride);
    return { memoryState: memoryState.slice(), hit: false };
  });

  return { rows };
};
