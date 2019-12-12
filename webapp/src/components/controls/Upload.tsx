import React from "react";

import styles from "./Upload.module.scss";

interface UploadProps {
    setFiles?: (files: FileList | null) => void;
}

const Upload: React.FC<UploadProps> = ({
    setFiles
}) => {
    const onUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof setFiles === "function") {
            setFiles(event.target.files);
        }
    };

    return (
        <div
            className={ styles.upload }
        >
            <input
                type="file"
                onChange={ onUploadChange }
            />
        </div>
    );
};

export default Upload;
