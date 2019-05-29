import { PagingAlgorithm, AlgorithmResultRows } from "../lib/algorithm";
import { Queue } from "../lib/queue";

export const algorithmFifo: PagingAlgorithm = config => {
  const memoryState: Array<number | null> = Object.seal(
    new Array(config.memorySize).fill(null)
  );
  const memoryPagesSet: Set<number> = new Set();
  const deletionQueue: Queue<number> = new Queue();

  const rows: AlgorithmResultRows = config.inputTasks.map(({ pageNo }) => {
    if (memoryPagesSet.has(pageNo)) {
      return { memoryState: memoryState.slice(), hit: true };
    }

    if (memoryPagesSet.size < config.memorySize) {
      const freeIndex = memoryPagesSet.size;
      memoryState[freeIndex] = pageNo;
      deletionQueue.enqueue(freeIndex);
      memoryPagesSet.add(pageNo);
      return { memoryState: memoryState.slice(), hit: false };
    }

    const indexToOverride = deletionQueue.dequeue()!;
    memoryPagesSet.delete(memoryState[indexToOverride]!);
    memoryState[indexToOverride] = pageNo;
    memoryPagesSet.add(pageNo);
    deletionQueue.enqueue(indexToOverride);
    return { memoryState: memoryState.slice(), hit: false };
  });

  return { rows };
};
