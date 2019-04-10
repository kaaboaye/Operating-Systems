import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import { styles } from "../layout/style";
import { Chart } from "./Chart";
import { getConfig } from "../../algorithms/config";
import {
  DiskAlgorithm,
  AlgorithmResult,
  emptyAlgorithmResult
} from "../../algorithms/algorithm";
import { algorithmFcfs } from "../../algorithms/fcfs";
import { algorithmSstf } from "../../algorithms/sstf";
import { algorithmScan } from "../../algorithms/scan";
import { algorithmCScan } from "../../algorithms/c-scan";
import { algorithmEdf } from "../../algorithms/edf";

interface DashboardViewState {
  fcfs: AlgorithmResult;
  sstf: AlgorithmResult;
  scan: AlgorithmResult;
  cScan: AlgorithmResult;
  edf: AlgorithmResult;
  fdScan: AlgorithmResult;
}

class DashboardView extends React.Component<{}, Partial<DashboardViewState>> {
  state = {
    fcfs: emptyAlgorithmResult,
    sstf: emptyAlgorithmResult,
    scan: emptyAlgorithmResult,
    cScan: emptyAlgorithmResult,
    edf: emptyAlgorithmResult,
    fdScan: emptyAlgorithmResult
  };

  readonly algorithms: ReadonlyArray<{
    name: string;
    state: keyof DashboardViewState;
    algorithm: DiskAlgorithm;
  }> = [
    {
      name: "FCFS",
      state: "fcfs",
      algorithm: algorithmFcfs
    },
    {
      name: "SSTF",
      state: "sstf",
      algorithm: algorithmSstf
    },
    {
      name: "SCAN",
      state: "scan",
      algorithm: algorithmScan
    },
    {
      name: "C-SCAN",
      state: "cScan",
      algorithm: algorithmCScan
    },
    {
      name: "EDF",
      state: "edf",
      algorithm: algorithmEdf
    }
  ];

  componentDidMount = () => {
    const conf = getConfig();
    this.algorithms.forEach(alg => {
      setTimeout(() => {
        this.setState({ [alg.state]: alg.algorithm(conf) });
      }, 0);
    });
  };

  render() {
    const { classes } = this.props as any;

    const elements = this.algorithms.map(alg => {
      return (
        <span key={alg.name}>
          <Typography variant="h4" gutterBottom component="h2">
            {alg.name}
          </Typography>
          <Typography component="div" className={classes.chartContainer}>
            <Typography component="p">
              Disk movement: {this.state[alg.state].totalDiskMovement}
            </Typography>
            <Chart data={this.state[alg.state].points} />
          </Typography>
        </span>
      );
    });

    return <div>{elements}</div>;
  }
}

export default withStyles(styles)(DashboardView);
