import { useContext } from "react";

import { PlaythroughContext } from "./PlaythroughProvider";

const usePlaythrough = () => useContext(PlaythroughContext);

export default usePlaythrough;
