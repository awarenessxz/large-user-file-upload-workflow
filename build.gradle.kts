plugins {
	base
	id("org.springframework.boot") version "2.7.1" apply false
	id("io.spring.dependency-management") version "1.0.11.RELEASE" apply false
	kotlin("jvm") version "1.6.21" apply false
	kotlin("plugin.spring") version "1.6.21" apply false
}

allprojects {
	group = "com.uploader"
	version = "0.0.1-SNAPSHOT"
	repositories {
		mavenCentral()
	}
}
