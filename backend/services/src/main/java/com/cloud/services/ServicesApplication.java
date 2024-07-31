package com.cloud.services;

import com.cloud.services.database.DatabaseConnectionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class ServicesApplication implements CommandLineRunner {

	@Autowired
	private DatabaseConnectionHandler databaseConnectionHandler;

	public static void main(String[] args) {
		SpringApplication.run(ServicesApplication.class, args);
	}

	@Override
	public void run(String[] args) {
		databaseConnectionHandler.setupDatabase();
	}
}
