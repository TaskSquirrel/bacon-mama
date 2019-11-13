import React, { useState } from "react";
import NavBar from "../../controls/NavBar";

import Steps from "./Steps";
import ItemPicker from "./ItemPicker";
import Editor from "./Editor";

import style from "./ContentCreatorView.module.scss";

const CreateRecipe: React.FC = () => {
    
    return (
        <div className={ style.container }>
            <div className={ style.top }>
                <NavBar className={ style.circle } userName={ "Ben" } />
            </div>
            <div className={ style.content }>
                <div className={ style.left }>
                    <Steps />
                </div>
                <div className={style.editor}>
                    <div className={ style.rightTop }>
                        <ItemPicker />
                    </div>
                    <div className={ style.rightBottom }>
                        <Editor />
                    </div>
                </div>
            </div>
            <div className={ style.bottom }>d</div>
        </div>
    );
};

export default CreateRecipe;
