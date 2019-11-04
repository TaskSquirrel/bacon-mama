import React from "react";
import { RouteComponentProps } from "react-router";

export interface Route {
    to: string;
    exact: boolean;
    component?: React.FC;
    render?: (props?: RouteComponentProps) => React.ReactNode;
}
