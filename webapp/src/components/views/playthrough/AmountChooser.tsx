import React from "react";
import classNames from "classnames";

import ButtonBase from "../../controls/ButtonBase";
import AuraButton from "../../controls/AuraButton";
import usePlaythrough from "./usePlaythrough";

import styles from "./Play.module.scss";

interface AmountChooserProps {
    amountRequired?: number;
    replace: (amount: number) => void;
}

const AmountChooser: React.FC<AmountChooserProps> = ({
    amountRequired,
    replace,
}) => {
    const amounts = [0.1, 1, 5, 10, 50, 100];
    const {
        stepDone,
        selected,
        nextStep,
    } = usePlaythrough();

    const visible = stepDone || selected;

    const createReplace = (amount: number) => () => replace(amount);

    const renderButtons = () => amounts.map((amount) => {
        return (
            <AuraButton
                key={ amount }
                size="medium"
                className={ styles.button }
                onClick={ createReplace(amount) }
            >
                { amount }
            </AuraButton>
        );
    });

    const renderChooser = () => {
        return (
            <>
                <h3>
                    How many to add?
                </h3>
                <div
                    className={ styles.buttons }
                >
                    { renderButtons() }
                </div>
            </>
        );
    };

    const renderForwards = () => {
        return (
            <>
                <h2>
                    Nice! This step's done!
                </h2>
                <div>
                    <ButtonBase
                        onClick={ nextStep }
                        className={ styles.next }
                    >
                        Next step
                    </ButtonBase>
                </div>
            </>
        );
    };

    return (
        <div
            className={ classNames(
                styles.chooser,
                !visible && styles.hide
            ) }
        >
            { stepDone
                ? renderForwards()
                : renderChooser() }
        </div>
    );
};

export default AmountChooser;
