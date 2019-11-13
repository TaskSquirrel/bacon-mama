import React, { useContext } from "react";
import NavBar from "../../controls/NavBar";

import Steps from "./Steps";
import ItemPicker from "./ItemPicker";

import style from "./ContentCreatorView.module.scss";
import ButtonBase from "../../controls/ButtonBase";
import { ContentCreatorContext } from "./ContentCreatorProvider";

const CreateRecipe: React.FC = () => {
    const {
        actions: {
            openAddItem
        }
    } = useContext(ContentCreatorContext);

    return (
        <div className={ style.container }>
            <div className={ style.top }>
                <ButtonBase
                    onClick={ openAddItem }
                >
                    Add item
                </ButtonBase>
            </div>
            <div className={ style.content }>
                <div className={ style.left }>
                    <Steps />
                </div>
                <div className={ style.center }>
                    <ItemPicker />
                </div>
            </div>
            <div className={ style.bottom }>d</div>
        </div>
    );
};

export default CreateRecipe;
