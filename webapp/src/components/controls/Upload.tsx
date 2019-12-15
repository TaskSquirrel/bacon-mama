import React from "react";
import classNames from "classnames";

import styles from "./Upload.module.scss";

interface UploadProps {
    files?: FileList | null;
    setFiles?: (files: FileList | null) => void;
}

const Upload: React.FC<UploadProps> = ({
    files,
    setFiles,
}) => {
    const clearFiles = () => setFiles && setFiles(null);

    const onUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof setFiles === "function") {
            setFiles(event.target.files);
        }
    };

    const renderContents = () => {
        if (files && files.length > 0) {
            const firstFile = files[0];

            return (
                <div
                    className={ styles.file }
                >
                    <div>
                        { firstFile.name }
                    </div>
                    <div>
                        <span
                            role="button"
                            onClick={ clearFiles }
                        >
                            <i
                                className="fas fa-times"
                            />
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <>
                <input
                    type="file"
                    className={ styles.input }
                    onChange={ onUploadChange }
                />
                <div>
                    <i
                        className={ classNames(
                            styles.icon,
                            "fas fa-file-upload"
                        ) }
                    />
                    <span>
                        Click to upload
                    </span>
                </div>
            </>
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
