import { useContext } from "react";

import UserContext from "../User/UserContext";

const useUser = () => useContext(UserContext);

export default useUser;
