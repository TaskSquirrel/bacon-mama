import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { ContentCreatorContext } from "./ContentCreatorProvider";
import Stack from "../../shared/Stack";
import ButtonBase from "../../controls/ButtonBase";
import Editable from "../../controls/Editable";
import ConfirmationModal from "./modals/ConfirmationModal";

import styles from "./UtilityBar.module.scss";
import useUser from "../../hooks/useUser";

const UtilityBar: React.FC = () => {
    const {
        metadata: {
            id,
            name,
            description,
        },
        actions: {
            setRecipeModal,
            setAddItemModal,
            replaceRecipe,
        }
    } = useContext(ContentCreatorContext);
    const { push } = useHistory();
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const { role } = useUser();
    
    const createPrompStateSetter = (state: boolean) => () =>
        setShowPrompt(state);

    const openRecipeDetailsModal = () => setRecipeModal(true);

    const openAddItemModal = () => setAddItemModal(true);

    const onEnterPress = (text: string) => replaceRecipe(text, description);

    const action = (confirmed: boolean) => {
        if (confirmed) {
            push(`/play/${id}`);
        } else {
            setShowPrompt(false);
        }
    };

    const renderPlayPrompt = () => {
        return (
            <ConfirmationModal
                show={ showPrompt }
                title="Start playthrough?"
                prompt="Try your recipe out?"
                actionText="Start"
                onAction={ action }
            />
        );
    };

    return (
        <div
            className={styles.bar}
        >
            <div
                className={styles.metadata}
            >
                <Editable
                    text={name}
                    className={styles.name}
                    onEnterPress={onEnterPress}
                />
            </div>
            {role && role !== "student" && (<Stack
                inline
                className={styles.actions}
            >
                <ButtonBase
                    inverted
                    clear
                    onClick={ openRecipeDetailsModal }
                >
                    <i
                        className="fas fa-pen"
                    />
                </ButtonBase>
                <ButtonBase
                    inverted
                    clear
                    onClick={openAddItemModal}
                >
                    <i
                        className="fas fa-plus"
                    />
                </ButtonBase>
                <ButtonBase
                    inverted
                    clear
                    onClick={ createPrompStateSetter(true) }
                >
                    <i
                        className="fas fa-play"
                    />
                </ButtonBase>
                <ButtonBase
                    className={styles.share}
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
            )}
            { renderPlayPrompt() }
        </div>
    );
};

export default UtilityBar;
