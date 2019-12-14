import React, { useState, useContext, useEffect } from "react";

import { APIImageResponse } from "../../../../models/API";

import { ContentCreatorContext } from "../ContentCreatorProvider";
import Modal from "../../../shared/Modal";
import TextField from "../../../controls/TextField";
import TextArea from "../../../controls/TextArea";
import Upload from "../../../controls/Upload";
import ButtonBase from "../../../controls/ButtonBase";
import Stack from "../../../shared/Stack";

import { createChangeEventStateSetter } from "../../../../utils";
import APIClient from "../../../../api/APIClient";

import styles from "./modals.module.scss";
import addItemModalStyles from "./AddItemModal.module.scss";

const MAX_FILE_SIZE_IN_BYTES = 1000000;

interface AddItemProps {
    control: (state: boolean) => void;
}

const AddItem: React.FC<AddItemProps> = ({
    control
}) => {
    const {
        items,
        actions: {
            addItem,
        }
    } = useContext(ContentCreatorContext);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageID, setImageID] = useState<number | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);

    const itemNameAlreadyInUse = items.find(
        ({ name: itemName }) => itemName === name
    );

    const close = () => control(false);

    const uploadFile = (uploads: FileList | null) => {
        if (uploads && uploads.length > 0) {
            const file = uploads[0];

            if (file.size > MAX_FILE_SIZE_IN_BYTES) {
                setError("File exceeded limit of 1MB!");
            } else {
                setError(null);
                setFiles(uploads);
            }
        }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name === "" || description === "" || itemNameAlreadyInUse) {
            return;
        }

        if (uploading) {
            return;
        }

        addItem(name, description, imageID);
        control(false);
    };

    useEffect(() => {
        if (files && files.length > 0) {
            const file = files[0];

            const upload = async () => {
                setUploading(true);

                const formData = new FormData();

                formData.append("file", file);

                try {
                    const { data: {
                        status,
                        message,
                        id: responseImageID
                     } } = await APIClient.request<APIImageResponse>(
                        "/images/add",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                            data: formData,
                        }
                    );

                    if (status === "OK") {
                        setImageID(responseImageID);
                    } else {
                        throw new Error(message);
                    }
                } catch (e) {
                    setError(e.message);
                    setFiles(null);
                } finally {
                    setUploading(false);
                }
            };

            upload();
        }
    }, [files]);

    return (
        <Modal
            show
            title="Add item"
        >
            <form
                onSubmit={ submit }
            >
                <Stack>
                    { itemNameAlreadyInUse && (
                        <div
                            className={ addItemModalStyles.error }
                        >
                            { `"${name}" is already an item!` }
                        </div>
                    ) }
                    <TextField
                        required
                        placeholder="Item name"
                        value={ name }
                        onChange={ createChangeEventStateSetter(
                            setName
                        ) }
                    />
                    <TextArea
                        placeholder="Item description"
                        value={ description }
                        onChange={ createChangeEventStateSetter(
                            setDescription
                        ) }
                    />
                    <Upload
                        files={ files }
                        setFiles={ uploadFile }
                    />
                    { error && (
                        <div>
                            { error }
                        </div>
                    ) }
                    <div
                        className={ styles.actions }
                    >
                        <ButtonBase
                            inverted
                            clear
                            type="button"
                            disabled={ uploading }
                            onClick={ close }
                        >
                            Cancel
                        </ButtonBase>
                        <ButtonBase
                            type="submit"
                            disabled={ uploading }
                        >
                            Save
                        </ButtonBase>
                    </div>
                </Stack>
            </form>
        </Modal>
    );
};

export default AddItem;
