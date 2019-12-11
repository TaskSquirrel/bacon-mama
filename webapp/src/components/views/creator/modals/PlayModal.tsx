import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import Stack from "../../../shared/Stack";
import Modal from "../../../shared/Modal";
import ButtonBase from "../../../controls/ButtonBase";

import styles from "./PlayModal.module.scss";

interface PlayModalProps {
    control: (state: boolean) => void;
}

const PlayModal: React.FC<PlayModalProps> = ({
    control
}) => {
    const {
        metadata: { id }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();

    const openPlayer = () => push(`/play/${id}`);

    const close = () => control(false);

    return (
        <Modal
            show
            title="Play through this recipe?"
            onBackdropClick={ close }
        >
            <Stack>
                <div>
                    Play through this recipe?
                </div>
                <div>
                    <Stack
                        inline
                        className={ styles.actions }
                    >
                        <ButtonBase
                            inverted
                            clear
                            onClick={ close }
                        >
                            Go back
                        </ButtonBase>
                        <ButtonBase
                            onClick={ openPlayer }
                        >
                            Play
                        </ButtonBase>
                    </Stack>
                </div>
            </Stack>
        </Modal>
    );
};

export default PlayModal;
