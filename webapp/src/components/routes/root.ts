import { Route } from "../../models/Router";

import SignIn from "../views/SignIn";
import ContentCreator from "../views/creator/ContentCreator";

const routes: Route[] = [
    {
        to: "/sign-in",
        exact: true,
        component: SignIn
    },
    {
        to: "/edit/:id",
        exact: true,
        component: ContentCreator
    }
];

export default routes;
