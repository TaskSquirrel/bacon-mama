import React from "react";

import ContentCreatorProvider from "./ContentCreatorProvider";
import ItemsViewerView from "./ItemsViewerView";

const ItemsViewer: React.FC = () => (
    <ContentCreatorProvider>
        <ItemsViewerView />
    </ContentCreatorProvider>
);

export default ItemsViewer;
