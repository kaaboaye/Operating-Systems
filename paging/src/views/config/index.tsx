import React, { ChangeEvent } from "react";
import { TextField, Button } from "@material-ui/core";
import {
  Config,
  defaultConfig,
  getConfig,
  generateInputData,
  saveConfig
} from "../../lib/config";

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
    const config = saveConfig(changes);
    this.setState(config);
  };

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
            const str = event.target.value.replace(/\D/g, "");
            const num = Number.parseInt(str);
            return Number.isFinite(num) ? num : 0;
          });
        }

        default:
          return event.target.value;
      }
    })();

    this.setPersistentState({ [name]: value });
  };

  generateInputData = () => {
    this.setPersistentState({ inputTasks: generateInputData(this.state) });
  };

  reset = () => {
    if (window.localStorage) {
      window.localStorage.removeItem("config");
    }
    this.setPersistentState(Object.assign({}, defaultConfig));
  };

  render() {
    return (
      <div>
        <TextField
          label="Memory size"
          name="memorySize:int"
          value={this.state.memorySize}
          onChange={this.handleChange}
          style={formStyles}
        />

        <TextField
          label="Number of tasks"
          name="numberOfTasks:int"
          value={this.state.numberOfTasks}
          onChange={this.handleChange}
          style={formStyles}
        />

        <TextField
          label="Number of pages"
          name="numberOfPages:int"
          value={this.state.numberOfPages}
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
          value={this.state.inputTasks.map(t => t.pageNo.toString()).join("\n")}
          onChange={this.handleChange}
          multiline
          style={formStyles}
        />
      </div>
    );
  }
}
