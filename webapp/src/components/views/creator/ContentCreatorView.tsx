import React, { useContext } from "react";

import { ContentCreatorContext } from "./ContentCreatorProvider";

const ContentCreatorView: React.FC = () => {
    const {
        metadata
    } = useContext(ContentCreatorContext);

    return (
        <div>
            Hello
        </div>
    );
};

export default ContentCreatorView;
