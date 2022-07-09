package com.uploader.filesystem.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import com.uploader.filesystem.exception.ApiException
import com.uploader.filesystem.exception.ErrorCode
import com.uploader.filesystem.model.UploadFileMetadata
import com.uploader.filesystem.model.UploadFileResponse
import org.apache.commons.fileupload.FileItemIterator
import org.apache.commons.fileupload.servlet.ServletFileUpload
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.util.StringUtils
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import javax.servlet.http.HttpServletRequest
import kotlin.io.path.*

@Service
class FileStorageService(
    @Value("\${my.uploader.root-dir}") private val rootDir: String,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(FileStorageService::class.java)
    }

    private fun createDirectoryIfNotExists(storagePath: Path) {
        if (!storagePath.exists()) {
            try {
                storagePath.createDirectory()
            } catch (e: Exception) {
                throw ApiException("Fail to create upload path", ErrorCode.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
    }

    fun uploadFiles(metadata: UploadFileMetadata, files: List<MultipartFile>): List<UploadFileResponse> {
        logger.info("[FILE SYSTEM] Uploading files to File System.....")
        val results = ArrayList<UploadFileResponse>()
        val storagePath = Paths.get(rootDir).resolve(StringUtils.cleanPath(metadata.storagePath))
        createDirectoryIfNotExists(storagePath)

        try {
            files.forEach { multipartFile ->
                val fileName = StringUtils.cleanPath(multipartFile.originalFilename!!)
                val filePath = storagePath.resolve(fileName)
                Files.copy(multipartFile.inputStream, filePath)
                results.add(UploadFileResponse(filePath.pathString, fileName))
            }
        } catch (e: Exception) {
            throw ApiException("Could not store the files... ${e.message}", ErrorCode.UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return results
    }

    fun uploadFilesViaStreams(request: HttpServletRequest): List<UploadFileResponse> {
        logger.info("[FILE SYSTEM] Uploading files to File System using input stream.....")

        // process upload
        val fileUploaderHandler = ServletFileUpload()
        val iterStream: FileItemIterator = fileUploaderHandler.getItemIterator(request)
        val results = ArrayList<UploadFileResponse>()
        var storagePath = Paths.get(rootDir)
        var metadata: UploadFileMetadata? = null
        try {
            while(iterStream.hasNext()) {
                val item = iterStream.next()
                logger.info("|--- Uploaded File = ${item.name}")

                // retrieve metadata (First Multipart File should be Metadata)
                if (metadata == null) {
                    // retrieve metadata from uploaded json file
                    if (item != null && item.fieldName == "metadata") {
                        val mapper = ObjectMapper().registerKotlinModule()
                        metadata = mapper.readValue(item.openStream(), UploadFileMetadata::class.java)
                    } else {
                        throw ApiException("Metadata missing from upload!", ErrorCode.METADATA_NOT_FOUND, HttpStatus.BAD_REQUEST)
                    }

                    // create directory
                    storagePath = storagePath.resolve(StringUtils.cleanPath(metadata.storagePath))
                    createDirectoryIfNotExists(storagePath)
                    continue
                }

                // process uploaded files
                if (item.fieldName == "files") {
                    val fileName = StringUtils.cleanPath(item.name)
                    val filePath = storagePath.resolve(fileName)
                    Files.copy(item.openStream(), filePath, StandardCopyOption.REPLACE_EXISTING)
                    results.add(UploadFileResponse(filePath.pathString, fileName))
                    continue
                }

                throw ApiException("Invalid Upload", ErrorCode.UPLOAD_FAILED, HttpStatus.BAD_REQUEST)
            }
        } catch (e: Exception) {
            throw ApiException("Could not store the files... ${e.message}", ErrorCode.UPLOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return results
    }
}
