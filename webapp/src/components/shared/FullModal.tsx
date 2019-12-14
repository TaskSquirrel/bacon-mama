import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import Portal from "./Portal";

import styles from "./FullModal.module.scss";

interface FullModalProps {
    show: boolean;
    title?: string;
    subtitle?: string;
    control: () => void;
}

const FullModal: React.FC<FullModalProps> = ({
    children,
    show,
    title,
    subtitle,
    control
}) => {
    const close = () => control();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Escape") {
                close();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    });

    return (
        <Portal>
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
                    enterActive: styles.show,
                    enterDone: styles.show
                } }
            >
                <div
                    className={ styles.container }
                >
                    <div
                        className={ styles.top }
                    >
                        <div>
                            <h1
                                className={ styles.heading }
                            >
                                { title }
                            </h1>
                            { subtitle && (
                                <div
                                    className={ styles.subtitle }
                                >
                                    { subtitle }
                                </div>
                            ) }
                        </div>
                        <div>
                            <button
                                className={ styles.close }
                                onClick={ close }
                            >
                                <i
                                    className="fas fa-times"
                                />
                            </button>
                        </div>
                    </div>
                    <div>
                        { children }
                    </div>
                </div>
            </CSSTransition>
        </Portal>
    );
};

export default FullModal;
