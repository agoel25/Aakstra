// This file has been adapted from starter code of CPSC 304 Summer
// 2024 Tutorial 2: https://github.students.cs.ubc.ca/CPSC304/CPSC304_Java_Project
package com.cloud.services.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.stereotype.Component;

@Component
public class DatabaseConnectionHandler {
    private static final String EXCEPTION_TAG = "[EXCEPTION]";

    private Connection connection = null;

    final private String oracleUrl = "jdbc:oracle:thin:@localhost:1522:stu";
    final private String username = "";
    final private String password = "";

    public DatabaseConnectionHandler() {
        try {
            connection = DriverManager.getConnection(oracleUrl, username, password);
            connection.setAutoCommit(false);
            System.out.println("Connected to Oracle!");
        } catch (SQLException e) {
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        }
    }

    public void close() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        }
    }

    private void rollbackConnection() {
        try {
            connection.rollback();
        } catch (SQLException e) {
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        }
    }

    public void setupDatabase() {
        try {
            String sqlQuery = "CREATE TABLE Customer (" +
                    "Email VARCHAR(30) PRIMARY KEY," +
                    "Name VARCHAR(30) NOT NULL," +
                    "PhoneNumber VARCHAR(15) NOT NULL UNIQUE," +
                    "Password VARCHAR(30) NOT NULL," +
                    "Address VARCHAR(50) NOT NULL" +
                    ")";
            executeQuery(sqlQuery);
            System.out.println("Tables created!");
        } catch (Exception e){
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        }
    }

    public void executeQuery(String query) {
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.execute();
            connection.commit();
        } catch (SQLException e) {
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
            rollbackConnection();
        }
    }
}