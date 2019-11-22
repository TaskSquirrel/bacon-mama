import { Route } from "../../models/Router";

import requireSignedIn from "../shared/requireSignedIn";
import SignIn from "../views/SignIn";
import SignOut from "../views/SignOut";
import Dashboard from "./../views/Dashboard";
import ContentCreator from "../views/creator/ContentCreator";
import Register from "../views/Register";
import ItemsViewer from "../views/creator/ItemsViewer";

const routes: Route[] = [
    {
        to: "/sign-in",
        exact: true,
        component: requireSignedIn(true)(SignIn)
    },
    {
        to: "/sign-up",
        exact: true,
        component: requireSignedIn(true)(Register)
    },
    {
        to: "/sign-out",
        exact: true,
        component: requireSignedIn()(SignOut)
    },
    {
        to: "/edit/:id",
        exact: true,
        component: requireSignedIn()(ContentCreator)
    },
    {
        to: "/edit/:id/:sequence",
        exact: false,
        component: requireSignedIn()(ContentCreator)
    },
    {
        to: "/items/:id/:sequence",
        exact: true,
        component: ItemsViewer
    },
    {
        to: "/dashboard",
        exact: true,
        component: requireSignedIn()(Dashboard)
    }
];

export default routes;
