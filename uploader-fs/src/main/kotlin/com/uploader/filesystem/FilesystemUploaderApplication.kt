package com.uploader.filesystem

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class FilesystemUploaderApplication

fun main(args: Array<String>) {
	runApplication<FilesystemUploaderApplication>(*args)
}
