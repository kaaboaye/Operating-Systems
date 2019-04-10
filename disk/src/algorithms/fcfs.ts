import { ChartDataPoint, DiskAlgorithm } from "./algorithm";

// Accumulator = chartData, totalDiskMovement, currentPosition
type Accumulator = [ChartDataPoint[], number, number];

export const algorithmFcfs: DiskAlgorithm = config => {
  const [points, totalDiskMovement] = config.inputData.reduce(
    ([chartData, totalDiskMovement, currentPosition], { position: task }) => {
      const currentDistance = Math.abs(currentPosition - task);
      chartData.push({ position: task });
      return [chartData, totalDiskMovement + currentDistance, task];
    },
    [
      [{ position: config.startingPoint }],
      0,
      config.startingPoint
    ] as Accumulator
  );

  return { points, totalDiskMovement };
};
