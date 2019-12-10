import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import Stack from "../../shared/Stack";
import ButtonBase from "../../controls/ButtonBase";
import Editable from "../../controls/Editable";

import styles from "./UtilityBar.module.scss";

const UtilityBar: React.FC = () => {
    const {
        metadata: {
            id,
            name,
            description
        },
        actions: {
            setAddItemModal,
            replaceRecipe
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();

    const openPlayer = () => push(`/play/${id}`);

    const openAddItemModal = () => setAddItemModal(true);

    const onEnterPress = (text: string) => {
        replaceRecipe(text, description);
    };

    return (
        <div
            className={ styles.bar }
        >
            <div
                className={ styles.metadata }
            >
                <Editable
                    text={ name }
                    className={ styles.name }
                    onEnterPress={ onEnterPress }
                />
            </div>
            <Stack
                inline
                className={ styles.actions }
            >
                <ButtonBase
                    inverted
                    clear
                >
                    <i
                        className="fas fa-pen"
                    />
                </ButtonBase>
                <ButtonBase
                    inverted
                    clear
                    onClick={ openAddItemModal }
                >
                    <i
                        className="fas fa-plus"
                    />
                </ButtonBase>
                <ButtonBase
                    inverted
                    clear
                    onClick={ openPlayer }
                >
                    <i
                        className="fas fa-play"
                    />
                </ButtonBase>
                <ButtonBase
                    className={ styles.share }
                >
                    <span>
                        <i
                            className="fas fa-share"
                        />
                    </span>
                    <span>
                        Share
                    </span>
                </ButtonBase>
            </Stack>
        </div>
    );
};

export default UtilityBar;
