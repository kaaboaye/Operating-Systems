import { DiskAlgorithm } from "./algorithm";

export const algorithmScan: DiskAlgorithm = config => {
  let totalDiskMovement = 0;
  let currentPosition = config.startingPoint;

  const points = [{ position: currentPosition }];
  const tasks = config.inputData.map(t => t.position);

  // tasks before current position
  tasks
    .filter(t => t <= currentPosition)
    .sort((a, b) => b - a)
    .forEach(task => {
      totalDiskMovement += Math.abs(currentPosition - task);
      tasks.splice(tasks.indexOf(task), 1);
      currentPosition = task;
      points.push({ position: task });
    });

  // if any left execute the rest of the tasks
  if (tasks.length !== 0) {
    totalDiskMovement += currentPosition;

    if (currentPosition !== 0) {
      points.push({ position: 0 });
      currentPosition = 0;
    }

    tasks
      .sort((a, b) => a - b)
      .forEach(task => {
        totalDiskMovement += Math.abs(task - currentPosition);
        currentPosition = task;
        points.push({ position: task });
      });
  }

  return { points, totalDiskMovement };
};
