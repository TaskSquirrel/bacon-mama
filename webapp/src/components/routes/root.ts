import { Route } from "../../models/Router";

import SignIn from "../views/SignIn";
import ContentCreator from "../views/creator/ContentCreator";
import Register from "../views/Register";
import Dashboard from "./../views/Dashboard";
import CreateRecipe from "../views/CreateRecipe";

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
        to: "/dashboard",
        exact: true,
        component: Dashboard
    },
    {
        to: "/createRec",
        exact: true,
        component: CreateRecipe
    }
];

export default routes;
