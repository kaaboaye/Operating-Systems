import React, { ReactNode } from "react";
import { AlgorithmResultRows } from "../../lib/algorithm";
import { Config } from "../../lib/config";

export interface ChartProps {
  data: AlgorithmResultRows;
  config: Config;
}

export class Chart extends React.Component<ChartProps> {
  render() {
    return (
      <table style={{ textAlign: "center" }}>
        <thead>{this.tableHead}</thead>
        <tbody>{this.tableBody}</tbody>
      </table>
    );
  }

  get tableHead(): ReactNode {
    const headers = (this.props.data[0] || { memoryState: [] }).memoryState.map(
      (_, i) => <th key={i}>{(i + 1).toString()}</th>
    );
    return (
      <tr>
        <th>Page</th>
        {headers}
      </tr>
    );
  }

  get tableBody(): ReactNode {
    return this.props.data.map((data, idr) => {
      const cols = data.memoryState.map((col, idc) => {
        return (
          <td key={idc}>
            <span style={{ color: data.hit ? "green" : "red" }}>
              {col || "_"}
            </span>
          </td>
        );
      });
      return (
        <tr key={idr}>
          <td>{this.props.config.inputTasks[idr].pageNo}</td>
          {cols}
        </tr>
      );
    });
  }
}
