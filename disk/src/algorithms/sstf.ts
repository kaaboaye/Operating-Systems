import { DiskAlgorithm } from "./algorithm";
import { minBy } from "../lib";

export const algorithmSstf: DiskAlgorithm = config => {
  const tasks = config.inputData.map(t => t.position);
  const points = [{ position: config.startingPoint }];
  let totalDiskMovement = 0;
  let currentPosition = config.startingPoint;

  for (let i = 0; i < config.inputData.length; ++i) {
    const closestPosition = minBy(tasks, t => Math.abs(t - currentPosition));
    totalDiskMovement += Math.abs(currentPosition - closestPosition);
    currentPosition = closestPosition;
    tasks.splice(tasks.indexOf(closestPosition), 1);
    points.push({ position: closestPosition });
  }

  return { points, totalDiskMovement };
};
