import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import DelayedIndicator from "../../shared/DelayedIndicator";
import Stack from "../../shared/Stack";
import Sidebar from "./Sidebar";
import Play from "./Play";
import ButtonBase from "../../controls/ButtonBase";

import useAPI from "../../hooks/useAPI";
import usePlaythrough from "./usePlaythrough";

import styles from "./PlaythroughView.module.scss";

const PlaythroughView: React.FC = () => {
    const {
        error,
        stepDone,
        recipe,
        errorMarks,
        isLastStep,
    } = usePlaythrough();
    const request = useAPI();

    useEffect(() => {
        if (!recipe) {
            return;
        }

        if (isLastStep && stepDone) {
            const saveHistory = async () => {
                const { data: { status } } = await request(
                    "/completeRecipe",
                    {
                        method: "POST",
                        data: {
                            recipeId: recipe.id
                        }
                    }
                );

                if (status !== "OK") {
                    // Error
                }
            };

            saveHistory();
        }
    }, [isLastStep, stepDone, recipe, request]);

    if (error) {
        return (
            <div>
                Error loading recipe
            </div>
        );
    }

    if (!recipe) {
        return (
            <DelayedIndicator />
        );
    }

    if (isLastStep && stepDone) {
        return (
            <Stack
                className={ styles.done }
            >
                <h1>
                    Congrats! Recipe completed!
                </h1>
                <div
                    className={ classNames(errorMarks > 0 && styles.error) }
                >
                    { errorMarks === 0
                        ? "Wow! Your cooking was flawless!"
                        : `You made ${errorMarks} error${errorMarks > 1 ? "s" : ""}!` }
                </div>
                <div>
                    <Link
                        to="/"
                    >
                        <ButtonBase>
                            Done
                        </ButtonBase>
                    </Link>
                </div>
            </Stack>
        );
    }

    return (
        <main
            className={ styles.container }
        >
            <div
                className={ styles.left }
            >
                <Sidebar />
            </div>
            <div
                className={ styles.right }
            >
                <Play />
            </div>
        </main>
    );
};

export default PlaythroughView;
