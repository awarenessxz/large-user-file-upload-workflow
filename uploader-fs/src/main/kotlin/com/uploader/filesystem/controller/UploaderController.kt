package com.uploader.filesystem.controller

import com.uploader.filesystem.exception.ApiException
import com.uploader.filesystem.exception.ErrorCode
import com.uploader.filesystem.model.UploadFileMetadata
import com.uploader.filesystem.model.UploadFileResponse
import com.uploader.filesystem.service.FileStorageService
import org.apache.commons.fileupload.servlet.ServletFileUpload
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import javax.servlet.http.HttpServletRequest

@RestController
@RequestMapping("/api/fs")
class UploaderController(
    private val storageService: FileStorageService
) {
    /**
     * MultiPart File Upload
     **/
    @PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE], produces = ["application/json"])
    fun uploadMultipleFiles(
        @RequestPart("metadata", required = true) metadata: UploadFileMetadata,
        @RequestPart("files") files: List<MultipartFile>
    ): List<UploadFileResponse> {
        return storageService.uploadFiles(metadata, files)
    }

    /**
     * MultiPart File Upload using apache commons fileupload (Able to handle large file uploads)
     **/
    @PostMapping("/stream/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE], produces = ["application/json"])
    fun uploadMultipleFilesViaStreams(request: HttpServletRequest): List<UploadFileResponse> {
        val isMultipart = ServletFileUpload.isMultipartContent(request)
        if (!isMultipart) {
            throw ApiException("Invalid Multipart Request", ErrorCode.CLIENT_ERROR, HttpStatus.BAD_REQUEST)
        }
        return storageService.uploadFilesViaStreams(request)
    }
}