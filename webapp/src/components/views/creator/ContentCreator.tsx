import React from "react";

import ContentCreatorProvider from "./ContentCreatorProvider";
import ContentCreatorView from "./ContentCreatorView";

const ContentCreator: React.FC = () => {
    return (
        <ContentCreatorProvider>
            <ContentCreatorView />
        </ContentCreatorProvider>
    );
};

export default ContentCreator;
