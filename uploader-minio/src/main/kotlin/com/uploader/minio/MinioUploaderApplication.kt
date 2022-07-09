package com.uploader.minio

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MinioUploaderApplication

fun main(args: Array<String>) {
	runApplication<MinioUploaderApplication>(*args)
}
