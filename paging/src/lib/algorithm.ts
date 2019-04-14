import { Config } from "./config";

export interface AlgorithmResultRow {
  readonly memoryState: ReadonlyArray<number | null>;
  readonly hit: boolean;
}

export type AlgorithmResultRows = ReadonlyArray<AlgorithmResultRow>;

export interface AlgorithmResult {
  readonly rows: AlgorithmResultRows;
}

export const emptyAlgorithmResult: AlgorithmResult = {
  rows: []
};

export type PagingAlgorithm = (config: Config) => AlgorithmResult;
