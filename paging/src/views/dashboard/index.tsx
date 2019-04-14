import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import { styles } from "../layout/style";
import { Chart } from "./Chart";
import { getConfig, readConfig, Config } from "../../lib/config";
import {
  AlgorithmResult,
  emptyAlgorithmResult,
  PagingAlgorithm
} from "../../lib/algorithm";
import { algorithmFifo } from "../../algorithms/algorithmFifo";
import { algorithmOpt } from "../../algorithms/algorithmOpt";
import { algorithmLru } from "../../algorithms/algorithmLru";
import { algorithmRand } from "../../algorithms/algorithmRand";

interface DashboardViewAlgorithmsState {
  fifo: AlgorithmResult;
  opt: AlgorithmResult;
  lru: AlgorithmResult;
  arlu: AlgorithmResult;
  rand: AlgorithmResult;
}

interface DashboardViewState {
  algorithms: DashboardViewAlgorithmsState;
  config: Config;
}

class DashboardView extends React.Component<{}, Partial<DashboardViewState>> {
  state = {
    fifo: emptyAlgorithmResult,
    opt: emptyAlgorithmResult,
    lru: emptyAlgorithmResult,
    arlu: emptyAlgorithmResult,
    rand: emptyAlgorithmResult,
    config: readConfig()
  };

  readonly algorithms: ReadonlyArray<{
    name: string;
    state: keyof DashboardViewAlgorithmsState;
    algorithm: PagingAlgorithm;
  }> = [
    {
      name: "FIFO",
      state: "fifo",
      algorithm: algorithmFifo
    },
    {
      name: "OPT",
      state: "opt",
      algorithm: algorithmOpt
    },
    {
      name: "LRU",
      state: "fifo",
      algorithm: algorithmLru
    },
    {
      name: "RAND",
      state: "rand",
      algorithm: algorithmRand
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
      const result = this.state[alg.state];
      const pageHits = result.rows.reduce(
        (acc, { hit }) => (hit ? acc + 1 : acc),
        0
      );
      const pageFaults = result.rows.length - pageHits;
      const pageHitRatio = Math.round(
        (100 * pageHits) / (pageHits + pageFaults)
      );

      return (
        <span
          style={{ display: "inline-block", marginRight: "5em" }}
          key={alg.name}
        >
          <Typography variant="h4" gutterBottom component="h2">
            {alg.name}
          </Typography>
          <Typography component="div" className={classes.chartContainer}>
            <Typography component="p">Page hits: {pageHits}</Typography>
            <Typography component="p">Page faults: {pageFaults}</Typography>
            <Typography component="p">
              Page hit ratio: {pageHitRatio}%
            </Typography>
            <Chart data={result.rows} config={this.state.config} />
          </Typography>
        </span>
      );
    });

    return <div>{elements}</div>;
  }
}

export default withStyles(styles)(DashboardView);
