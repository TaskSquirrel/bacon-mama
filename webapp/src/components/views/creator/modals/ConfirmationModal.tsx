import React from "react";

import Stack from "../../../shared/Stack";
import Modal from "../../../shared/Modal";
import ButtonBase from "../../../controls/ButtonBase";

import styles from "./ConfirmationModal.module.scss";

interface ConfirmationModalProps {
    show: boolean;
    title: string;
    prompt: string;
    cancelText?: string;
    actionText?: string;
    onAction: (confirmed: boolean) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    show,
    title,
    prompt,
    cancelText,
    actionText,
    onAction,
}) => {
    const createOnActionCaller = (state: boolean) => () => onAction(state);

    return (
        <Modal
            show={ show }
            title={ title }
            onBackdropClick={ createOnActionCaller(false) }
        >
            <Stack>
                <div>
                    { prompt }
                </div>
                <div>
                    <Stack
                        inline
                        className={ styles.actions }
                    >
                        <ButtonBase
                            inverted
                            clear
                            onClick={ createOnActionCaller(false) }
                        >
                            { cancelText || "Go back" }
                        </ButtonBase>
                        <ButtonBase
                            onClick={ createOnActionCaller(true) }
                        >
                            { actionText || "OK" }
                        </ButtonBase>
                    </Stack>
                </div>
            </Stack>
        </Modal>
    );
};

export default ConfirmationModal;
