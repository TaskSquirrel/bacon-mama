import React, { useState } from "react";
import style from "./CreateRecipe.module.scss";
import NavBar from "../controls/NavBar";

const CreateRecipe: React.FC  = () => {

    return (
        <div className={style.container}>
            <div className={style.top}>
                <NavBar className={style.circle} userName={"Ben"} />
            </div>
            <div className={style.content}>
                <div className={style.left}>
                    a
                </div>
                <div className={style.center}>
                    b
                </div>
                <div className={style.right}>
                    c
                </div>
            </div>
            <div className={style.bottom}>
                d
            </div>
        </div>
    );
    
}

export default CreateRecipe;