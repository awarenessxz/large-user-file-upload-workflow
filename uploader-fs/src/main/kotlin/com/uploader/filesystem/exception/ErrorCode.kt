package com.uploader.filesystem.exception

enum class ErrorCode {
    SERVER_ERROR,
    CLIENT_ERROR,
    METADATA_NOT_FOUND,
    INVALID_METADATA,
    MAX_UPLOAD_FILE_SIZE_EXCEED,
    UPLOAD_FAILED
}