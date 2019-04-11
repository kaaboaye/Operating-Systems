import React, { ChangeEvent } from "react";
import { TextField, Button } from "@material-ui/core";
import {
  Config,
  defaultConfig,
  getConfig,
  generateInputData,
  InputData
} from "../../algorithms/config";

const formStyles = {
  display: "block",
  margin: "1em"
};

const buttonStyles = {
  margin: "1em"
};

export class ConfigView extends React.Component<{}, Config> {
  state = getConfig();

  setPersistentState = (changes: Partial<Config>) => {
    if (window.localStorage) {
      const state = (() => {
        const state = window.localStorage.getItem("config");
        return state ? JSON.parse(state) : {};
      })();

      Object.assign(state, changes);
      window.localStorage.setItem("config", JSON.stringify(state));
    }

    this.setState(changes as Config);
  };

  private readonly intArrayRegex = /^\d+,\d+$/;

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [name, type] = event.target.name.split(":");

    const value = (() => {
      switch (type) {
        case "int": {
          const str = event.target.value.replace(/\D/g, "");
          const num = Number.parseInt(str);
          return Number.isFinite(num) ? num : 0;
        }

        case "intArray": {
          return event.target.value.split("\n").map(x => {
            const match = x.match(this.intArrayRegex);
            if (!match) {
              return { position: 0, deadline: 0 };
            }

            const [position, deadline] = match[0]
              .split(",")
              .map(x => Number.parseInt(x, 10));
            return { position, deadline };
          }) as InputData;
        }

        default:
          return event.target.value;
      }
    })();

    this.setPersistentState({ [name]: value });
  };

  generateInputData = () => {
    this.setPersistentState({ inputData: generateInputData(this.state) });
  };

  reset = () => {
    if (window.localStorage) {
      window.localStorage.removeItem("config");
    }
    this.setState(Object.assign({}, defaultConfig));
  };

  render() {
    return (
      <div>
        <TextField
          label="Disk size"
          name="diskSize:int"
          value={this.state.diskSize}
          onChange={this.handleChange}
          style={formStyles}
        />

        <TextField
          label="Starting point"
          name="startingPoint:int"
          value={this.state.startingPoint}
          onChange={this.handleChange}
          style={formStyles}
        />

        <TextField
          label="Data size"
          name="dataSize:int"
          value={this.state.dataSize}
          onChange={this.handleChange}
          style={formStyles}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={this.generateInputData}
          style={buttonStyles}
        >
          Generate input data
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={this.reset}
          style={buttonStyles}
        >
          Restore configuration
        </Button>

        <TextField
          label="Input data"
          name="inputData:intArray"
          value={this.state.inputData
            .map(t => `${t.position},${t.deadline}`)
            .join("\n")}
          onChange={this.handleChange}
          multiline
          style={formStyles}
        />
      </div>
    );
  }
}
