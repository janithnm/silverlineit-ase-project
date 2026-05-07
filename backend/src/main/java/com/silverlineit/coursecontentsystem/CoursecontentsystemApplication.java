package com.silverlineit.coursecontentsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CoursecontentsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoursecontentsystemApplication.class, args);
	}

}
