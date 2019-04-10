import React from "react";
import { Route } from "react-router";
import DashboardView from "./views/dashboard";
import { ConfigView } from "./views/config";

export class Router extends React.Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={DashboardView} />
        <Route exact path="/config" component={ConfigView} />
      </div>
    );
  }
}
