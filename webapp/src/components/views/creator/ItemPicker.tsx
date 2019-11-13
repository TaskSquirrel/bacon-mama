import React, { useContext, useState } from "react";

import style from './ItemPicker.module.scss';

import { ContentCreatorContext } from './ContentCreatorProvider';
import { Item } from "../../../models/recipe";

const ItemPicker: React.FC = () => {

    const {
        items,
    } = useContext(ContentCreatorContext);

    const [pickedItem, setItem] = useState<Item[]>([{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"},{name:"hi"}]);

    

    return (
        <div className={style.container}>
            <button className={style.add}>
                +
            </button>
            <div className={style.items}>
                {pickedItem.map((item) => {
                    return(
                        <div className={style.item}>
                            {item.name}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default ItemPicker;
