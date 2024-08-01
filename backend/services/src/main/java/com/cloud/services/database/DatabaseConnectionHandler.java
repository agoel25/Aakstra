// This file has been adapted from starter code of CPSC 304 Summer
// 2024 Tutorial 2: https://github.students.cs.ubc.ca/CPSC304/CPSC304_Java_Project
package com.cloud.services.database;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

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
        dropTablesIfExists();
        List<String> queryList = new ArrayList<String>();

        try {
            queryList.add("CREATE TABLE Customer (" +
                    "Email VARCHAR(30) PRIMARY KEY," +
                    "Name VARCHAR(30) NOT NULL," +
                    "PhoneNumber VARCHAR(15) NOT NULL UNIQUE," +
                    "Password VARCHAR(30) NOT NULL," +
                    "Address VARCHAR(50) NOT NULL" +
                    ")");

            queryList.add("CREATE TABLE Project (" +
                    "ProjectID INTEGER PRIMARY KEY," +
                    "Name VARCHAR(30)," +
                    "Description VARCHAR(100)," +
                    "CreationDate DATE NOT NULL," +
                    "Status VARCHAR(20)" +
                    ")");
            queryList.add("CREATE TABLE PartOf (" +
                    "Email VARCHAR(30)," +
                    "ProjectID INTEGER," +
                    "PRIMARY KEY (Email, ProjectID)," +
                    "FOREIGN KEY (Email) REFERENCES Customer(Email)," +
                    "FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE AddressInfo (" +
                    "PostalCode VARCHAR(15) PRIMARY KEY," +
                    "City VARCHAR(20) NOT NULL," +
                    "Country VARCHAR(20) NOT NULL" +
                    ")");

            queryList.add("CREATE TABLE BillingInfo (" +
                    "CardNumber INTEGER PRIMARY KEY," +
                    "PaymentType VARCHAR(6) NOT NULL" +
                    ")");

            queryList.add("CREATE TABLE PaymentInfo (" +
                    "CardNumber INTEGER," +
                    "Email VARCHAR(30)," +
                    "CVV INTEGER NOT NULL," +
                    "PostalCode VARCHAR(15) NOT NULL," +
                    "ExpiryDate DATE NOT NULL," +
                    "IsDefault VARCHAR(5)," +
                    "PRIMARY KEY (CardNumber, Email)," +
                    "FOREIGN KEY (Email) REFERENCES Customer(Email)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (CardNumber) REFERENCES BillingInfo(CardNumber)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (PostalCode) REFERENCES AddressInfo(PostalCode)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE ServiceType (" +
                    "Type VARCHAR(20) PRIMARY KEY," +
                    "CostType VARCHAR(20) NOT NULL" +
                    ")");


            queryList.add("CREATE TABLE ServiceDetails (" +
                    "Name VARCHAR(30) PRIMARY KEY," +
                    "Type VARCHAR(20) NOT NULL," +
                    "Description VARCHAR(100) NOT NULL," +
                    "Status VARCHAR(20)," +
                    "CostPerUnit INTEGER NOT NULL," +
                    "FOREIGN KEY (Type) REFERENCES ServiceType(Type)" +
                    ")");

            queryList.add("CREATE TABLE CustomerUsesService (" +
                    "Email VARCHAR(30)," +
                    "Name VARCHAR(30)," +
                    "PRIMARY KEY (Email, Name)," +
                    "FOREIGN KEY (Email) REFERENCES Customer(Email)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (Name) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE ProjectUsesService (" +
                    "ProjectID INTEGER," +
                    "Name VARCHAR(30)," +
                    "PRIMARY KEY (ProjectID, Name)," +
                    "FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (Name) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE Storage (" +
                    "Name VARCHAR(30) PRIMARY KEY," +
                    "Capacity INTEGER," +
                    "Latency INTEGER," +
                    "FOREIGN KEY (Name) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE Compute (" +
                    "Name VARCHAR(30) PRIMARY KEY," +
                    "CPUCores INTEGER," +
                    "MaxMemory INTEGER," +
                    "FOREIGN KEY (Name) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE Functional (" +
                    "Name VARCHAR(30) PRIMARY KEY," +
                    "Timeout INTEGER," +
                    "ConcurrencyLimit INTEGER," +
                    "FOREIGN KEY (Name) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE Region (" +
                    "Name VARCHAR(30) PRIMARY KEY," +
                    "Location VARCHAR(20) NOT NULL," +
                    "Capacity INTEGER," +
                    "Status VARCHAR(20)" +
                    ")");

            queryList.add("CREATE TABLE AvailableIn (" +
                    "ServiceName VARCHAR(30)," +
                    "RegionName VARCHAR(30)," +
                    "PRIMARY KEY (ServiceName, RegionName)," +
                    "FOREIGN KEY (ServiceName) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (RegionName) REFERENCES Region(Name)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE ProjectSecurity (" +
                    "ProjectID INTEGER PRIMARY KEY," +
                    "SecurityGroupID INTEGER UNIQUE NOT NULL," +
                    "FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE SecurityProtocol (" +
                    "InboundProtocol VARCHAR(20) PRIMARY KEY," +
                    "OutboundProtocol VARCHAR(20)" +
                    ")");

            queryList.add("CREATE TABLE SecurityInfo (" +
                    "ProjectID INTEGER PRIMARY KEY," +
                    "Name VARCHAR(30)," +
                    "InboundProtocol VARCHAR(20)," +
                    "CreationDate DATE," +
                    "FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (InboundProtocol) REFERENCES SecurityProtocol(InboundProtocol)" +
                    ")");

            queryList.add("CREATE TABLE ServerTypeInfo (" +
                    "ServerType VARCHAR(30) PRIMARY KEY," +
                    "Memory INTEGER," +
                    "Storage INTEGER," +
                    "OS VARCHAR(20)," +
                    "CPUCores INTEGER" +
                    ")");

            queryList.add("CREATE TABLE ServerInfo (" +
                    "ServerID INTEGER PRIMARY KEY," +
                    "Name VARCHAR(30)," +
                    "ServerType VARCHAR(30)," +
                    "Status VARCHAR(20)," +
                    "Uptime INTEGER," +
                    "CreatedAt DATE," +
                    "UpdatedAt DATE," +
                    "FOREIGN KEY (Name) REFERENCES Region(Name)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (ServerType) REFERENCES ServerTypeInfo(ServerType)" +
                    "ON DELETE CASCADE" +
                    ")");

            queryList.add("CREATE TABLE Instance (" +
                    "InstanceID INTEGER PRIMARY KEY," +
                    "Name VARCHAR(30) NOT NULL," +
                    "ServerID INTEGER NOT NULL," +
                    "ProjectID INTEGER," +
                    "Type VARCHAR(20)," +
                    "TotalCost INTEGER," +
                    "Status VARCHAR(20)," +
                    "LaunchDate DATE," +
                    "StopDate DATE," +
                    "FOREIGN KEY (Name) REFERENCES ServiceDetails(Name)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (ServerID) REFERENCES ServerInfo(ServerID)" +
                    "ON DELETE CASCADE," +
                    "FOREIGN KEY (ProjectID) REFERENCES ProjectSecurity(ProjectID)" +
                    "ON DELETE SET NULL" +
                    ")");

            queryList.add("CREATE TABLE Bills (" +
                    "InstanceID INTEGER," +
                    "Email VARCHAR(30)," +
                    "CardNumber INTEGER," +
                    "Cost INTEGER," +
                    "PRIMARY KEY (InstanceID, Email, CardNumber)," +
                    "FOREIGN KEY (InstanceID) REFERENCES Instance(InstanceID)," +
                    "FOREIGN KEY (CardNumber, Email) REFERENCES PaymentInfo(CardNumber, Email)," +
                    "FOREIGN KEY (CardNumber) REFERENCES BillingInfo(CardNumber)" +
                    ")");

            for (String query : queryList) {
                executeQuery(query);
            }
            System.out.println("Tables created!");
        } catch (Exception e){
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
        }
    }

    private void dropTablesIfExists() {
        String query = "select table_name from user_tables";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                // refer to this link for documentation of CASCADE CONSTRAINTS:
                // https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/DROP-TABLE.html
                String dropQuery = "DROP TABLE " + rs.getString(1) + " CASCADE CONSTRAINTS";
                executeQuery(dropQuery);
                System.out.println("Dropped table: " + rs.getString(1));
            }
        } catch (SQLException e) {
            System.out.println(EXCEPTION_TAG + " " + e.getMessage());
            rollbackConnection();
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