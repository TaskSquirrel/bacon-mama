import React from "react";
import { CSSTransition } from "react-transition-group";

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
                <CSSTransition
                    in={ show }
                    appear
                    mountOnEnter
                    unmountOnExit
                    timeout={ {
                        appear: 0,
                        enter: 150,
                        exit: 150
                    } }
                    classNames={ {
                        enterActive: styles.appear,
                        enterDone: styles.appear
                    } }
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
                </CSSTransition>
            </div>
        </Portal>
    );
};

export default Modal;
