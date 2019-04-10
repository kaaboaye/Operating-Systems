import { Config } from "./config";

export interface ChartDataPoint {
  readonly position: number;
}

export interface AlgorithmResult {
  readonly points: ChartDataPoint[];
  readonly totalDiskMovement: number;
}

export const emptyAlgorithmResult = {
  points: [],
  totalDiskMovement: 0
};

export type DiskAlgorithm = (config: Config) => AlgorithmResult;
