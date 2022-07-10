import axios from "axios";
import React, { MouseEvent, useState } from "react";
import { useDropzone } from 'react-dropzone'
import Button from "react-bootstrap/cjs/Button";
import Col from "react-bootstrap/cjs/Col";
import Container from "react-bootstrap/cjs/Container";
import Form from "react-bootstrap/cjs/Form";
import ProgressBar from "react-bootstrap/cjs/ProgressBar";
import Row from "react-bootstrap/cjs/Row";
import Table from "react-bootstrap/cjs/Table";
import Spinner from "../loading/Spinner";
import { UploadFileMetadata } from "../../../types/api-types";
import Data from "../../../config/app.json";
import "./FileDropzone.css";

interface FileDropzoneProps {
    showUploads?: boolean;
    showConfigs?: boolean;
    onSuccessfulUploadCallback?: () => void;
    uploadUrl: string;
}

const FileDropzone = ({
    uploadUrl,
    showUploads = false,
    showConfigs = false,
    onSuccessfulUploadCallback = () => {}
}: FileDropzoneProps) => {
    const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
        maxSize: Data.dropzone.maxSizeInBytes
    });
    const uploadExceeded = (acceptedFiles.reduce((a, b) => a + b.size, 0) + fileRejections.reduce((a, b) => a + b.file.size, 0)) > Data.dropzone.maxSizeInBytes;
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [storagePath, setStoragePath] = useState("");

    const handleUpload = (e: MouseEvent<HTMLButtonElement>) => {
        // reset states
        setUploadPercentage(0);
        setLoading(true);

        const handleUploadSuccess = (res: any) => {
            setLoading(false);
            setSuccessMsg("Files have been uploaded successfully");
            console.log(res);
        };

        const handleUploadFailure = (err: any) => {
            setLoading(false);
            setErrorMsg("Upload Failed!");
        };

        const formData = new FormData();
        const metadata: UploadFileMetadata = { "storagePath": storagePath };
        formData.append("metadata", new Blob([JSON.stringify(metadata)], {
            type: "application/json"
        }));
        acceptedFiles.forEach(file => formData.append("files", file));

        const options = {
            onUploadProgress: (progressEvent: any) => {
                const {loaded, total} = progressEvent;
                const percent = Math.floor((loaded * 100) / total);
                if (percent <= 100) {
                    setUploadPercentage(percent);
                }
            }
        };

        // send request
        axios.post(uploadUrl, formData, options)
            .then(res => {
                if (res.status === 200) {
                    handleUploadSuccess(res.data);
                } else {
                    handleUploadFailure({ message: "Fail to upload file" });
                }
            })
            .catch(err => handleUploadFailure(err));
    };

    return (
        <Container className="dropzone-container">
            <div className="dropzone-input-box">
                <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <svg className="drop-icon" width="50" height="43" viewBox="0 0 50 43">
                        <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
                    </svg>
                    {uploadExceeded ? (
                        <div className="text-danger mt-2">
                            Upload is too large. Max upload size is {Data.dropzone.maxSizeInText}.
                        </div>
                    ) : (
                        <div>
                            {acceptedFiles.length === 0
                                ? <p>Drag and drop your files here, or click to select files.</p>
                                : <p>{acceptedFiles.length} files selected. {fileRejections.length > 0 && `${fileRejections.length} files rejected.`}</p>
                            }
                        </div>
                    )}
                </div>
                {acceptedFiles.length > 0 && !uploadExceeded && (
                    <div className="action-box">
                        <Button size="lg" onClick={handleUpload}>Upload</Button>
                    </div>
                )}
                {errorMsg && (
                    <div className="dropzone-box message-error">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="dropzone-box message-success">
                        {successMsg}
                    </div>
                )}
                {loading && uploadPercentage < 100 && (
                    <div className="dropzone-box loader">
                        <ProgressBar striped now={uploadPercentage} animated />
                    </div>
                )}
                {loading && uploadPercentage >= 100 && (
                    <Spinner spinnerType="ThreeDots" backgroundColor="#92b0b3" spinnerColor="#fff" />
                )}
            </div>
            {showConfigs && !loading && !successMsg && (
                <div className="dropzone-config-box">
                    <h5>Upload Settings</h5>
                    <Form>
                        <Form.Group as={Row} controlId="formHorizontalStoragePath">
                            <Form.Label column sm={4}>
                                Storage Path (SubDirectory)
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Optional Field. Eg. example/storage"
                                    value={storagePath}
                                    onChange={e => setStoragePath(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </div>
            )}
            {showUploads && !loading && !successMsg && acceptedFiles.length > 0 && (
                <div className="dropzone-result-box">
                    <Table responsive size="sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Filename</th>
                                <th>File Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acceptedFiles.map((file, idx) => (
                                <tr key={idx}>
                                    <td>{idx+1}</td>
                                    <td>{file.name}</td>
                                    <td>{file.size}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
};

export default FileDropzone;
