import { PagingAlgorithm, AlgorithmResultRows } from "../lib/algorithm";
import { maxBy } from "../lib";

export const algorithmOpt: PagingAlgorithm = config => {
  const memoryState = Object.seal(
    new Array<number | null>(config.memorySize).fill(null)
  );
  const memoryPagesSet = new Set<number>();

  const rows: AlgorithmResultRows = config.inputTasks.map(
    ({ pageNo }, i, tasks) => {
      if (memoryPagesSet.has(pageNo)) {
        return { memoryState: memoryState.slice(), hit: true };
      }

      if (memoryPagesSet.size < config.memorySize) {
        memoryState[memoryPagesSet.size] = pageNo;
        memoryPagesSet.add(pageNo);
        return { memoryState: memoryState.slice(), hit: false };
      }

      const indexToOverride = (() => {
        const featureTasks = tasks.slice(i).map(t => t.pageNo);

        const distances = memoryState.map((pageNo, idm) => {
          const i = featureTasks.indexOf(pageNo!);
          return [idm, i !== -1 ? i : Infinity];
        });

        const [indexToOverride] = maxBy(distances, ([_, x]) => x);
        return indexToOverride;
      })();

      memoryPagesSet.delete(memoryState[indexToOverride]!);
      memoryState[indexToOverride] = pageNo;
      memoryPagesSet.add(pageNo);
      return { memoryState: memoryState.slice(), hit: false };
    }
  );

  return { rows };
};
