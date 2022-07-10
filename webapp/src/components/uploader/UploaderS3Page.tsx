import React, { useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import Container from "react-bootstrap/cjs/Container";
import VerticallyCenteredModal from "../common/modal/VerticallyCenteredModal";
import FileDropzone from "../common/dropzone/FileDropzone";
import Data from "../../config/app.json";
import "./UploaderPage.css";

const UploaderS3Page = () => {
    const [modalShow, setModalShow] = useState(false);

    return (
        <React.Fragment>
            <header className="masthead">
                <Container>
                    <div className="mx-auto text-center">
                        <h1>{ Data.web_name }</h1>
                        <h3>Upload files workflow via Minio</h3>
                        <Button size="lg" onClick={() => setModalShow(true)}>
                            Upload
                        </Button>
                    </div>
                </Container>
            </header>
            <VerticallyCenteredModal
                title="Upload Files"
                content={<FileDropzone showUploads showConfigs uploadUrl={Data.api_endpoints.upload_files_s3} />}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </React.Fragment>
    );
};

export default UploaderS3Page;
