import React from "react";
import classNames from "classnames";

import styles from "./Slider.module.scss";

interface SliderProps extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement
> {
}

const Slider: React.FC<SliderProps> = ({
    ...props
}) => {
    return (
        <input
            { ...props }
            type="range"
            className={ classNames() }
        />
    );
};

export default Slider;
