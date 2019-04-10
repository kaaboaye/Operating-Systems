import { DiskAlgorithm } from "./algorithm";

export const algorithmCScan: DiskAlgorithm = config => {
  let totalDiskMovement = 0;
  let currentPosition = config.startingPoint;

  const tasks = config.inputData.map(t => t.position);
  const points = [{ position: currentPosition }];

  for (let i = 0; i < config.inputData.length; ++i) {
    const pointsBeforeDisk: number[] = (() => {
      const pointsBeforeDisk = tasks.filter(task => task <= currentPosition);
      if (pointsBeforeDisk.length === 0) {
        totalDiskMovement += currentPosition + config.diskSize;
        if (currentPosition !== 0) {
          points.push({ position: 0 });
        }
        currentPosition = config.diskSize;
        points.push({ position: config.diskSize });
        return tasks.filter(task => task <= currentPosition);
      }
      return pointsBeforeDisk;
    })();

    const task = Math.max.apply(Math, pointsBeforeDisk);
    totalDiskMovement += Math.abs(task - currentPosition);
    currentPosition = task;
    tasks.splice(tasks.indexOf(task), 1);
    points.push({ position: task });
  }

  return { points, totalDiskMovement };
};
