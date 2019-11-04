import { Route } from "../../models/Router";

import SignIn from "../views/SignIn";

const routes: Route[] = [
    {
        to: "/sign-in",
        exact: true,
        component: SignIn
    }
];

export default routes;
