import { DiskAlgorithm } from "./algorithm";
import { minBy } from "../lib";

export const algorithmEdf: DiskAlgorithm = config => {
  let currentPosition = config.startingPoint;
  let totalDiskMovement = 0;

  const points = [{ position: currentPosition }];
  const tasks = config.inputData.slice();

  tasks
    .sort((a, b) => a.deadline - b.deadline)
    .forEach(task => {
      const distance = Math.abs(currentPosition - task.position);

      if (totalDiskMovement + distance <= task.deadline) {
        totalDiskMovement += distance;
        currentPosition = task.position;
        points.push({ position: task.position });
      } else {
        console.log(
          `Missed position ${task.position} with deadline ${task.deadline}`
        );
      }

      tasks.splice(tasks.indexOf(task), 1);
    });

  const positions = tasks.map(t => t.position);
  tasks.forEach(() => {
    const closestPoint = minBy(positions, t => Math.abs(t - currentPosition));
    const distance = Math.abs(currentPosition - closestPoint);
    totalDiskMovement += distance;
    currentPosition = closestPoint;
    positions.splice(positions.indexOf(closestPoint), 1);
    points.push({ position: closestPoint });
  });

  return { points, totalDiskMovement };
};
