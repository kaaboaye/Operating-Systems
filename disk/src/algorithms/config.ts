export interface Task {
  readonly position: number;
  readonly deadline: number;
}

export type InputData = ReadonlyArray<Task>;

export interface Config {
  readonly diskSize: number;
  readonly startingPoint: number;
  readonly dataSize: number;
  readonly minDeadline: number;
  readonly maxDeadline: number;
  readonly inputData: InputData;
}

export const defaultConfig = {
  diskSize: 100,
  startingPoint: 50,
  dataSize: 20,
  minDeadline: 50,
  maxDeadline: 150,
  inputData: []
} as Config;

export function getConfig(): Config {
  const persistedConfig = (() => {
    if (!window.localStorage) {
      return {};
    }

    const state = window.localStorage.getItem("config");
    return state ? JSON.parse(state) : defaultConfig;
  })();

  if ((persistedConfig.inputData || []).length === 0) {
    const inputData = generateInputData(persistedConfig);
    window.localStorage.setItem(
      "config",
      JSON.stringify({ ...persistedConfig, inputData })
    );
    return getConfig();
  }

  return Object.assign({}, defaultConfig, persistedConfig);
}

export function generateInputData(config: Config): InputData {
  return new Array(config.dataSize).fill(0).map(() => ({
    position: Math.floor(Math.random() * config.diskSize + 1),
    deadline:
      config.minDeadline +
      Math.floor(Math.random() * (config.maxDeadline - config.minDeadline))
  }));
}
