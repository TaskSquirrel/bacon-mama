import { useContext } from "react";

import {
    TopLevelLoadingIndicatorContext
} from "../shared/TopLevelLoadingIndicator";

const useLoadingIndicator = () => {
    return useContext(TopLevelLoadingIndicatorContext);
};

export default useLoadingIndicator;
