import React, { useState } from "react";
import UserCircle from "../controls/UserCircle";
import style from "./CreateRecipe.module.scss";

const CreateRecipe: React.FC  = () => {

    return (
        <div className={style.container}>
            <div className={style.top}>
                <div className={style.step}>Step "X" out of 10</div>
                <UserCircle className={style.circle} userName={"Ben"} />
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