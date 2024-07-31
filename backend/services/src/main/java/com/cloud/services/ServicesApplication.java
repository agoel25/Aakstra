package com.cloud.services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.cloud.services.database.DatabaseConnectionHandler;

@SpringBootApplication
public class ServicesApplication {

	public static void main(String[] args) {
		DatabaseConnectionHandler dbHandler = new DatabaseConnectionHandler();
		SpringApplication.run(ServicesApplication.class, args);
	}
}
