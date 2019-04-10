import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon
} from "@material-ui/icons";
import { Link } from "react-router-dom";

const listItems = [
  {
    icon: <DashboardIcon />,
    text: "Wyniki",
    to: "/"
  },
  {
    icon: <SettingsIcon />,
    text: "Konfiguracja",
    to: "/config"
  }
].map(i => (
  <ListItem
    button
    component={((p: any) => <Link to={i.to} {...p} />) as any}
    key={i.to}
  >
    <ListItemIcon>{i.icon}</ListItemIcon>
    <ListItemText primary={i.text} />
  </ListItem>
));

export const mainListItems = <div>{listItems}</div>;

//
