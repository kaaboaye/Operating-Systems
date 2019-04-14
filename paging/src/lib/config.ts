export const configLocalStorageKey = "pagingAlgorithmsConfig";

export interface Task {
  readonly pageNo: number;
}

export type InputData = ReadonlyArray<Task>;

export interface Config {
  readonly memorySize: number;
  readonly numberOfPages: number;
  readonly numberOfTasks: number;
  readonly inputTasks: ReadonlyArray<Task>;
}

export const defaultConfig: Config = {
  memorySize: 6,
  numberOfPages: 100,
  numberOfTasks: 8,
  inputTasks: []
};

export function saveConfig(changes: Partial<Config>): Config {
  if (!window.localStorage) {
    return Object.assign({}, defaultConfig, changes);
  }

  const state = (() => {
    const state = window.localStorage.getItem(configLocalStorageKey);
    return state ? JSON.parse(state) : defaultConfig;
  })();

  Object.assign(state, changes);
  window.localStorage.setItem(configLocalStorageKey, JSON.stringify(state));
  return state;
}

export function getConfig(): Config {
  const persistedConfig = (() => {
    if (!window.localStorage) {
      return {};
    }

    const state = window.localStorage.getItem(configLocalStorageKey);
    return state ? JSON.parse(state) : defaultConfig;
  })();

  if ((persistedConfig.inputTasks || []).length === 0) {
    const inputTasks = generateInputData(persistedConfig);
    window.localStorage.setItem(
      configLocalStorageKey,
      JSON.stringify({ ...persistedConfig, inputTasks })
    );
    return readConfig();
  }

  return Object.assign({}, defaultConfig, persistedConfig);
}

export function readConfig(): Config {
  const persistedConfig = (() => {
    if (!window.localStorage) {
      return {};
    }

    const state = window.localStorage.getItem(configLocalStorageKey);
    return state ? JSON.parse(state) : defaultConfig;
  })();

  return Object.assign({}, defaultConfig, persistedConfig);
}

export function generateInputData(config: Config): InputData {
  return new Array(config.numberOfTasks).fill(0).map(() => ({
    pageNo: Math.floor(Math.random() * config.numberOfPages + 1)
  }));
}
