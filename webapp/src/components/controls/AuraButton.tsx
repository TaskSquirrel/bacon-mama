import React from "react";

import styles from "./AuraButton.module.scss";

export interface AuraButtonProps extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement
> {
}

const AuraButton: React.FC<AuraButtonProps> = ({
    ...props
}) => {
    return (
        <button
            { ...props }
        />
    );
};

export default AuraButton;
