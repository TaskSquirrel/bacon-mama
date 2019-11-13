import React, { MouseEvent } from "react";

import Portal from "./Portal";

import styles from "./Modal.module.scss";

export interface ModalProps {
    show: boolean;
    title?: string;
    onBackdropClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({
    children, show, title, onBackdropClick
}) => {
    const backdropClick = (
        event: React.MouseEvent
    ) => {
        if (
            event.target === event.currentTarget
            && typeof onBackdropClick === "function"
        ) {
            onBackdropClick();
        }
    };

    if (!show) {
        return null;
    }

    return (
        <Portal>
            <div
                className={ styles.backdrop }
                onClick={ backdropClick }
            >
                <div
                    className={ styles.dialog }
                >
                    <h2
                        className={ styles.heading }
                    >
                        { title || "Modal" }
                    </h2>
                    <div>
                        { children }
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default Modal;
