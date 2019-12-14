import React from "react";

import styles from "./Upload.module.scss";

interface UploadProps {
    files?: FileList | null;
    setFiles?: (files: FileList | null) => void;
}

const Upload: React.FC<UploadProps> = ({
    files,
    setFiles,
}) => {
    const onUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof setFiles === "function") {
            setFiles(event.target.files);
        }
    };

    const renderContents = () => {
        if (files) {
            return (
                <div>
                    You got files!
                </div>
            );
        }

        return (
            <input
                type="file"
                onChange={ onUploadChange }
            />
        );
    };

    return (
        <div
            className={ styles.upload }
        >
            { renderContents() }
        </div>
    );
};

export default Upload;
