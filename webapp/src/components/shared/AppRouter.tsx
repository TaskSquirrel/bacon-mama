import React from "react";
import { Route as Path, Switch, RouteComponentProps, Redirect } from "react-router-dom";

import { Route } from "../../models/Router";

export interface AppRouterProps {
    routes: Route[];
    fallback?: boolean;
}

const AppRouter: React.FC<AppRouterProps> = ({
    routes,
    fallback
}) => {
    const renderRoutes = () => routes.map(({
        to,
        exact,
        component: Component,
        render
    }) => {
        const renderChild = (props: RouteComponentProps) => {
            if (render) {
                return render(props);
            }

            if (Component) {
                return (
                    <Component />
                );
            }

            return null;
        };

        return (
            <Path
                key={ to }
                path={ to }
                exact={ exact }
                render={ renderChild }
            />
        );
    });

    return (
        <Switch>
            { renderRoutes() }
            { fallback && (
                <Redirect
                    to="/404"
                />
            ) }
        </Switch>
    );
};

export default AppRouter;
