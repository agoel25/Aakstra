package com.cloud.services;

import com.cloud.services.database.DatabaseConnectionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class ServicesApplication {

	public static void main(String[] args) {
		DatabaseConnectionHandler databaseConnectionHandler = new DatabaseConnectionHandler();
		SpringApplication.run(ServicesApplication.class, args);
	}

}
