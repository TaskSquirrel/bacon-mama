import { Route } from "../../models/Router";

import requireSignedIn from "../shared/requireSignedIn";
import Root from "../views/Root";
import SignIn from "../views/SignIn";
import SignOut from "../views/SignOut";
import Dashboard from "./../views/dashboard/Dashboard";
import ContentCreator from "../views/creator/ContentCreator";
import Register from "../views/Register";
import Playthrough from "../views/playthrough/Playthrough";
import Class from "../views/class/Class";
import NotFound from "../views/not-found/NotFound";

const routes: Route[] = [
    {
        to: "/",
        exact: true,
        component: Root
    },
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
        to: "/dashboard",
        exact: true,
        component: requireSignedIn()(Dashboard)
    },
    {
        to: "/play/:id",
        exact: true,
        component: requireSignedIn()(Playthrough)
    },
    {
        to: "/class",
        exact: true,
        component: requireSignedIn()(Class)
    },
    {
        to: "/404",
        exact: true,
        component: NotFound
    },
];

export default routes;
