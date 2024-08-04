// This file has been adapted from starter code of CPSC 304 Summer
// 2024 Tutorial 2: https://github.students.cs.ubc.ca/CPSC304/CPSC304_Java_Project
package com.cloud.services.database;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.cloud.services.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConnectionHandler {
    public static final Logger logger = LoggerFactory.getLogger(DatabaseConnectionHandler.class);
    private static final String EXCEPTION_TAG = "[EXCEPTION]";

    private Connection connection = null;

    final private String oracleUrl = "jdbc:oracle:thin:@localhost:1522:stu";
    final private String username = "";
    final private String password = "";

    public DatabaseConnectionHandler() {
        try {
            connection = DriverManager.getConnection(oracleUrl, username, password);
            connection.setAutoCommit(false);
            logger.info("Connected to Oracle!");
        } catch (SQLException e) {
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
        }
    }

    public void close() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
        }
    }

    private void rollbackConnection() {
        try {
            connection.rollback();
        } catch (SQLException e) {
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
        }
    }

    public void setupDatabase() {
        dropTablesIfExists();
        createAllTables();
        insertAllData();
    }

    // Project methods
    public Integer getNextProjectID() throws SQLException {
        String query = "SELECT COUNT(*) FROM project";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) + 1;
            }
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
        return null;
    }

    public boolean isProjectNameUnique(String name) throws SQLException {
        String query = "SELECT COUNT(*) FROM project WHERE Name = " + "'" + name + "'";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                if (rs.getInt(1) > 0) {
                    return false;
                }
            }
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
        return true;
    }

    public void updateProject(Project project) throws SQLException {
        if (!isProjectNameUnique(project.getName())) {
            logger.error(EXCEPTION_TAG + "Project name is not unique");
            throw new SQLException("Project name is not unique");
        } else {
            String updateQuery = "UPDATE project SET Name = ?, Description = ?, CreationDate = ?, Status = ? WHERE ProjectID = ?";
            try (PreparedStatement ps = connection.prepareStatement(updateQuery)) {
                ps.setString(1, project.getName());
                ps.setString(2, project.getDescription());
                ps.setDate(3, java.sql.Date.valueOf(project.getCreationDate()));
                ps.setString(4, project.getStatus());
                ps.setInt(5, project.getId());
                int rowCount = ps.executeUpdate();
                if (rowCount == 0) {
                    throw new SQLException("No rows affected.");
                }
                connection.commit();
                logger.info("Updated project {}", project.getName());
            } catch (SQLException e) {
                rollbackConnection();
                logger.error(EXCEPTION_TAG + " {}", e.getMessage());
                throw new SQLException(e.getMessage());
            }
        }
    }

    public void insertProject(Project project, String email, String partnerEmail) throws SQLException {
        // TODO: add name unique constraint
        String projectQuery = "INSERT INTO project VALUES (?,?,?,?,?,?)";
        try (PreparedStatement ps = connection.prepareStatement(projectQuery)) {
            ps.setInt(1, project.getId());
            ps.setString(2, project.getName());
            ps.setString(3, project.getDescription());
            ps.setDate(4, java.sql.Date.valueOf(project.getCreationDate()));
            ps.setString(5, project.getStatus());
            ps.setString(6, project.getPartnerEmail());
            ps.execute();
            connection.commit();
            logger.info("Inserted project {}", project.getName());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }

        String partOfQuery = "INSERT INTO PartOf VALUES (?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(partOfQuery)) {
            ps.setString(1, email);
            ps.setInt(2, project.getId());
            ps.execute();
            connection.commit();
            logger.info("Inserted project {} with customer {}", project.getName(), email);
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }

        String partnerPartOfQuery = "INSERT INTO PartOf VALUES (?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(partnerPartOfQuery)) {
            ps.setString(1, partnerEmail);
            ps.setInt(2, project.getId());
            ps.execute();
            connection.commit();
            logger.info("Inserted project {} with customer {}", project.getName(), partnerEmail);
        } catch (SQLIntegrityConstraintViolationException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLIntegrityConstraintViolationException(e.getMessage());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public List<Project> getAllProjects(String email) throws SQLException {
        String query = "SELECT Project.ProjectID, Project.Name, Project.Description, Project.CreationDate, Project.Status, Project.PartnerEmail " +
                       "FROM Project, PartOf " +
                       "WHERE Project.ProjectID = PartOf.ProjectID AND PartOf.Email = ?";

        List<Project> allProjects = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Project project = new Project(rs.getInt("ProjectID"), rs.getString("Name"), rs.getString("Description"), rs.getString("CreationDate"), rs.getString("Status"), rs.getString("PartnerEmail"));
                allProjects.add(project);
            }
            logger.info("Got all Projects {}", email);
        }
        return allProjects;
    }

    public void deleteProject(String projectID) throws SQLException {
        String projectQuery = "DELETE FROM project WHERE ProjectID = ?";
        try (PreparedStatement ps = connection.prepareStatement(projectQuery)) {
            ps.setInt(1, Integer.parseInt(projectID));
            int numDeletedRows = ps.executeUpdate();
            if (numDeletedRows <= 0) {
                throw new SQLException();
            }
            connection.commit();
            logger.info("Deleted project {}", projectID);
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public List<ServiceDetails> getAllServices(String projectID) throws SQLException {
        String query = "SELECT ServiceDetails.Name, ServiceDetails.Description, ServiceDetails.Status, ServiceDetails.CostPerUnit, ServiceType.Type, ServiceType.CostType " +
                "FROM ProjectUsesService, ServiceDetails, ServiceType " +
                "WHERE ProjectUsesService.Name = ServiceDetails.Name AND ServiceDetails.Type = ServiceType.Type AND ProjectUsesService.ProjectID = ?";

        List<ServiceDetails> allServices = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, projectID);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                ServiceDetails serviceDetails = new ServiceDetails(rs.getString("Name"), rs.getString("Description"), rs.getString("Status"), rs.getString("CostPerUnit"), rs.getString("Type"), rs.getString("CostType"));
                allServices.add(serviceDetails);
            }
            logger.info("Got all Services {}", projectID);
        }
        return allServices;
    }

    // Customer methods
    public void insertCustomer(Customer customer) throws SQLException {
        String query = "INSERT INTO customer VALUES (?,?,?,?,?)";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, customer.getEmail());
            ps.setString(2, customer.getName());
            ps.setString(3, customer.getPhoneNumber());
            ps.setString(4, customer.getPassword());
            ps.setString(5, customer.getAddress());
            // TODO: unique constraint on phone number
            ps.execute();
            connection.commit();
            logger.info("Inserted customer {}", customer.getEmail());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public List<Customer> getCustomerDetails(String email) throws SQLException {
        String query = "SELECT * FROM Customer WHERE Email = ?";

        List<Customer> allCustomers = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Customer customer = new Customer(rs.getString("email"), rs.getString("name"), rs.getString("phoneNumber"), rs.getString("password"), rs.getString("address"));
                allCustomers.add(customer);
            }
            logger.info("Got all Customer Information {}", email);
        }
        return allCustomers;
    }

    public boolean loginCheck(String email, String password) throws SQLException {
        String query = "SELECT * FROM customer WHERE email = ? AND password = ?";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, email);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return true;
            }
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
        return false;
    }

    // Billing Methods
    public void addBilling(BillingDetails billingDetails) throws SQLException {
        String addressInfoQuery = "INSERT INTO AddressInfo VALUES (?,?,?)";
        try (PreparedStatement ps = connection.prepareStatement(addressInfoQuery)) {
            ps.setString(1, billingDetails.getPostalCode());
            ps.setString(2, billingDetails.getCity());
            ps.setString(3, billingDetails.getCountry());
            ps.execute();
            connection.commit();
            logger.info("Inserted Address Info {}", billingDetails.getEmail());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }

        String billingInfoQuery = "INSERT INTO BillingInfo VALUES (?,?)";
        try (PreparedStatement ps = connection.prepareStatement(billingInfoQuery)) {
            ps.setString(1, billingDetails.getCardNumber());
            ps.setString(2, billingDetails.getPaymentType());
            ps.execute();
            connection.commit();
            logger.info("Inserted Billing Info {}", billingDetails.getEmail());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }

        String paymentInfoQuery = "INSERT INTO PaymentInfo VALUES (?,?,?,?,?,?)";
        try (PreparedStatement ps = connection.prepareStatement(paymentInfoQuery)) {
            ps.setString(1, billingDetails.getCardNumber());
            ps.setString(2, billingDetails.getEmail());
            ps.setInt(3, Integer.parseInt(billingDetails.getCVV()));
            ps.setString(4, billingDetails.getPostalCode());
            ps.setDate(5, java.sql.Date.valueOf(billingDetails.getExpiryDate()));
            ps.setString(6, billingDetails.getIsDefault());
            ps.execute();
            connection.commit();
            logger.info("Inserted Payment Info {}", billingDetails.getEmail());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public List<BillingDetails> getAllCards(String email) throws SQLException {
        String query = "SELECT PaymentInfo.CardNumber, PaymentInfo.Email, PaymentInfo.CVV, PaymentInfo.PostalCode, PaymentInfo.ExpiryDate, PaymentInfo.isDefault, AddressInfo.City, AddressInfo.Country, BillingInfo.PaymentType " +
                "FROM PaymentInfo, AddressInfo, BillingInfo " +
                "WHERE PaymentInfo.PostalCode = AddressInfo.PostalCode AND PaymentInfo.CardNumber = BillingInfo.CardNumber AND PaymentInfo.Email = ?";

        List<BillingDetails> allBillingDetails = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                BillingDetails billingDetails = new BillingDetails(rs.getString("CardNumber"), rs.getString("Email"), rs.getString("CVV"), rs.getString("PostalCode"), rs.getString("ExpiryDate"), rs.getString("isDefault"), rs.getString("City"), rs.getString("Country"), rs.getString("PaymentType"));
                allBillingDetails.add(billingDetails);
            }
            logger.info("Got all Billing Details {}", allBillingDetails);
        }
        return allBillingDetails;
    }

    // Instance Methods
    public Integer getNextInstanceID() throws SQLException {
        String query = "SELECT COUNT(*) FROM Instance";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) + 1;
            }
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
        return null;
    }

    public void addInstance(Instance instance) throws SQLException {
        String addressInfoQuery = "INSERT INTO Instance VALUES (?,?,?,?,?,?,?,?,?)";
        try (PreparedStatement ps = connection.prepareStatement(addressInfoQuery)) {
            ps.setInt(1, instance.getInstanceID());
            ps.setString(2, instance.getName());
            ps.setInt(3, Integer.parseInt(instance.getServerID()));
            ps.setInt(4, Integer.parseInt(instance.getProjectID()));
            ps.setString(5, instance.getType());
            ps.setString(6, instance.getTotalCost());
            ps.setString(7, instance.getStatus());
            ps.setDate(8, java.sql.Date.valueOf(instance.getLaunchDate()));
            ps.setDate(9, java.sql.Date.valueOf(instance.getStopDate()));
            ps.execute();
            connection.commit();
            logger.info("Inserted Instance Info {}", instance.getInstanceID());
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public List<Instance> getAllInstances(String projectID, String serviceName) throws SQLException {
        String query = "SELECT * FROM Instance WHERE ProjectID = ? AND Name = ?";

        List<Instance> allInstances = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, Integer.parseInt(projectID));
            ps.setString(2, serviceName);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Instance instance = new Instance(rs.getInt("InstanceID"), rs.getString("Name"), rs.getString("ServerID"), rs.getString("ProjectID"), rs.getString("Type"), rs.getString("TotalCost"), rs.getString("Status"), rs.getString("LaunchDate"), rs.getString("stopDate"));
                allInstances.add(instance);
            }
            logger.info("Got all Services {}", projectID);
        }
        return allInstances;
    }

    public void insertProjectService(String projectID, String name) throws SQLException {
        String query = "INSERT INTO ProjectUsesService VALUES (?,?)";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, Integer.parseInt(projectID));
            ps.setString(2, name);
            ps.execute();
            connection.commit();
            logger.info("Inserted service {} for project {}", name, projectID);
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public void insertCustomerService(String email, String name) throws SQLException {
        String query = "INSERT INTO CustomerUsesService VALUES (?,?)";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, email);
            ps.setString(2, name);
            ps.execute();
            connection.commit();
            logger.info("Inserted service {} for customer {}", name, email);
        } catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
    }

    public List<List<String>> projection(String attributes, String relation, Integer numAttributes) throws SQLException {
        String query = "SELECT " + attributes + " FROM " + relation;

        List<List<String>> results = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                List<String> tuple = new ArrayList<>();

                for (int i = 1; i <= numAttributes; i++) {
                    String attributeVal = rs.getString(i);
                    tuple.add(attributeVal);
                }
                results.add(tuple);
            }
            logger.info("Got all Results {}", relation);
        }  catch (SQLException e) {
            rollbackConnection();
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            throw new SQLException(e.getMessage());
        }
        return results;
    }

    public void insertAllData() {
        try {
            Customer john = new Customer("john.doe@dummy.com", "John Doe","1234567890", "password", "9090 main st, vancouver");
            insertCustomer(john);
        } catch (SQLException e) {
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            rollbackConnection();
        }
    }

    public void dropTablesIfExists() {
        String query = "select table_name from user_tables";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                // refer to this link for documentation of CASCADE CONSTRAINTS:
                // https://docs.oracle.com/en/database/oracle/oracle-database/19/sqlrf/DROP-TABLE.html
                String dropQuery = "DROP TABLE " + rs.getString(1) + " CASCADE CONSTRAINTS";
                executeQuery(dropQuery);
                logger.info("Dropped table: {}", rs.getString(1));
            }
        } catch (SQLException e) {
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            rollbackConnection();
        }
    }

    public void executeQuery(String query) {
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.execute();
            connection.commit();
        } catch (SQLException e) {
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
            rollbackConnection();
        }
    }

    public void createAllTables() {
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
                    "Status VARCHAR(20)," +
                    "PartnerEmail VARCHAR(30)" +
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
                    "CardNumber CHAR(16) PRIMARY KEY," +
                    "PaymentType VARCHAR(6) NOT NULL" +
                    ")");

            queryList.add("CREATE TABLE PaymentInfo (" +
                    "CardNumber CHAR(16)," +
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
                    "CardNumber CHAR(16)," +
                    "Cost INTEGER," +
                    "PRIMARY KEY (InstanceID, Email, CardNumber)," +
                    "FOREIGN KEY (InstanceID) REFERENCES Instance(InstanceID)," +
                    "FOREIGN KEY (CardNumber, Email) REFERENCES PaymentInfo(CardNumber, Email)," +
                    "FOREIGN KEY (CardNumber) REFERENCES BillingInfo(CardNumber)" +
                    ")");

            queryList.add("INSERT INTO Region(Name, Location, Capacity, Status)" +
                    "VALUES ('us-east-1', 'Virginia', 500, 'Active')");

            queryList.add("INSERT INTO Region(Name, Location, Capacity, Status)" +
                    "VALUES ('us-east-2', 'Oregon', 500, 'Active')");

            queryList.add("INSERT INTO Region(Name, Location, Capacity, Status)" +
                    "VALUES ('eu-central-1', 'Frankfurt', 300, 'Active')");

            queryList.add("INSERT INTO Region(Name, Location, Capacity, Status)" +
                    "VALUES ('eu-west-1', 'Ireland', 300, 'Active')");

            queryList.add("INSERT INTO Region(Name, Location, Capacity, Status)" +
                    "VALUES ('sa-east-1', 'Caracas', 200, 'Active')");

            queryList.add("INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)" +
                    "VALUES ('functional.micro', 1, 8, 'Linux', 1)");

            queryList.add("INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)" +
                    "VALUES ('functional.large', 8, 32, 'Linux', 4)");

            queryList.add("INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)" +
                    "VALUES ('compute.large', 8, 64, 'Linux', 16)");

            queryList.add("INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)" +
                    "VALUES ('compute.xlarge', 16, 128, 'Linux', 32)");

            queryList.add("INSERT INTO ServerTypeInfo(ServerType, Memory, Storage, OS, CPUCores)" +
                    "VALUES ('storage.large', 32, 1024, 'Windows', 8)");

            queryList.add("INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)" +
                    "VALUES (101, 'us-east-1', 'functional.micro', 'Active', 1000, '2024-01-04', '2024-07-15')");

            queryList.add("INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)" +
                    "VALUES (102, 'us-east-2', 'functional.large', 'Active', 800, '2024-01-05', '2024-07-16')");

            queryList.add("INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)" +
                    "VALUES (103, 'eu-central-1', 'compute.large', 'Active', 600, '2024-02-01', '2024-07-16')");

            queryList.add("INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)" +
                    "VALUES (104, 'eu-west-1', 'compute.xlarge', 'Active', 1200, '2024-07-11', '2024-07-16')");

            queryList.add("INSERT INTO ServerInfo(ServerID, Name, ServerType, Status, Uptime, CreatedAt, UpdatedAt)" +
                    "VALUES (105, 'sa-east-1', 'storage.large', 'Inactive', 300, '2024-07-16', '2024-07-16')");

            queryList.add("INSERT INTO ServiceType(Type, CostType)" +
                    "VALUES ('Serverless', 'PerJob')");

            queryList.add("INSERT INTO ServiceType(Type, CostType)" +
                    "VALUES ('Authentication', 'PerUser')");

            queryList.add("INSERT INTO ServiceType(Type, CostType)" +
                    "VALUES ('GPUCompute', 'PerDay')");

            queryList.add("INSERT INTO ServiceType(Type, CostType)" +
                    "VALUES ('HPC', 'PerDay')");

            queryList.add("INSERT INTO ServiceType(Type, CostType)" +
                    "VALUES ('Database', 'PerQuery')");

            queryList.add("INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)" +
                    "VALUES ('gamma', 'Serverless', 'Handling serverless functions', 'Active', 1)");

            queryList.add("INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)" +
                    "VALUES ('authIt', 'Authentication', 'Authentication with large capacity', 'Active', 2)");

            queryList.add("INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)" +
                    "VALUES ('GPUb', 'GPUCompute', 'GPU-based rendering service', 'Active', 3)");

            queryList.add("INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)" +
                    "VALUES ('RapidX', 'HPC', 'High performance computing service', 'Active', 4)");

            queryList.add("INSERT INTO ServiceDetails(Name, Type, Description, Status, CostPerUnit)" +
                    "VALUES ('cSQL', 'Database', 'Cloud SQL database service', 'Active', 5)");

            queryList.add("INSERT INTO Project(ProjectID, Name, Description, CreationDate, Status)" +
                    "VALUES (1, 'Migrate', 'Migrating app to cloud', '2024-07-20', 'Active')");

            queryList.add("INSERT INTO Project(ProjectID, Name, Description, CreationDate, Status)" +
                    "VALUES (2, 'Analytics', 'Cloud analytics', '2024-07-20', 'Active')");

            queryList.add("INSERT INTO Project(ProjectID, Name, Description, CreationDate, Status)" +
                    "VALUES (3, 'OpsPipeline', 'Operations Pipeline', '2024-07-20', 'Active')");

            queryList.add("INSERT INTO Project(ProjectID, Name, Description, CreationDate, Status)" +
                    "VALUES (4, 'ModelTraining', 'AI models on cloud GPU', '2024-07-20', 'Active')");

            queryList.add("INSERT INTO Project(ProjectID, Name, Description, CreationDate, Status)" +
                    "VALUES (5, 'Store', 'Cloud storage', '2024-07-20', 'Active')");

            queryList.add("INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID)" +
                    "VALUES (1, 1)");

            queryList.add("INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID)" +
                    "VALUES (2, 2)");

            queryList.add("INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID)" +
                    "VALUES (3, 3)");

            queryList.add("INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID)" +
                    "VALUES (4, 4)");

            queryList.add("INSERT INTO ProjectSecurity(SecurityGroupID, ProjectID)" +
                    "VALUES (5, 5)");

            for (String query : queryList) {
                executeQuery(query);
            }
            logger.info("Tables created!");
        } catch (Exception e){
            logger.error(EXCEPTION_TAG + " {}", e.getMessage());
        }
    }
}