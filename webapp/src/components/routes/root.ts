import { Route } from "../../models/Router";

import SignIn from "../views/SignIn";
import ContentCreator from "../views/creator/ContentCreator";
import Register from "../views/Register";
import Dashboard from "./../views/Dashboard";
import ItemsViewer from "../views/creator/ItemsViewer";

const routes: Route[] = [
    {
        to: "/sign-in",
        exact: true,
        component: SignIn
    },
    {
        to: "/sign-up",
        exact: true,
        component: Register
    },
    {
        to: "/edit/:id",
        exact: true,
        component: ContentCreator
    },
    {
        to: "/edit/:id/:sequence",
        exact: true,
        component: ContentCreator
    },
    {
        to: "/items/:id/:sequence",
        exact: true,
        component: ItemsViewer
    },
    {
        to: "/dashboard",
        exact: true,
        component: Dashboard
    }
];

export default routes;
