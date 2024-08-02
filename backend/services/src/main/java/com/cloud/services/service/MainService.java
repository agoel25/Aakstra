package com.cloud.services.service;

import com.cloud.services.database.DatabaseConnectionHandler;
import com.cloud.services.model.BillingDetails;
import com.cloud.services.model.Customer;
import com.cloud.services.model.Instance;
import com.cloud.services.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;

@Service
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MainService {

    @Autowired
    private DatabaseConnectionHandler databaseConnectionHandler;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestParam String email,
                                         @RequestParam String name,
                                         @RequestParam String phoneNumber,
                                         @RequestParam String password,
                                         @RequestParam String address) {
        try {
            Customer customer = new Customer(email, name, phoneNumber, password, address);
            databaseConnectionHandler.insertCustomer(customer);
            return new ResponseEntity<>("Customer created successfully", HttpStatus.OK);
        } catch (SQLException e) {
            return new ResponseEntity<>("Failed to create customer: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email,
                                        @RequestParam String password) {
        try {
            if (databaseConnectionHandler.loginCheck(email, password)) {
                return new ResponseEntity<>("Login successful", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Login failed", HttpStatus.UNAUTHORIZED);
            }
        } catch (SQLException e) {
            return new ResponseEntity<>("Failed to login: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addProject")
    public ResponseEntity<String> addProject(@RequestParam String email,
                                             @RequestParam String name,
                                             @RequestParam String description,
                                             @RequestParam String creationDate,
                                             @RequestParam String status,
                                             @RequestParam String partnerEmail) {
        try {
            Integer id = databaseConnectionHandler.getNextProjectID();
            Project project = new Project(id, name, description, creationDate, status, partnerEmail);
            databaseConnectionHandler.insertProject(project, email, partnerEmail);
            return new ResponseEntity<>("Project inserted successfully", HttpStatus.OK);
        } catch (SQLIntegrityConstraintViolationException e) {
            return new ResponseEntity<>("User with this email does not exist " + e.getMessage(), HttpStatus.CONFLICT);
        } catch (SQLException e) {
            return new ResponseEntity<>("Project insert failed " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addCard")
    public ResponseEntity<String> addCard(@RequestParam String cardNumber,
                                          @RequestParam String email,
                                          @RequestParam String cvv,
                                          @RequestParam String postalCode,
                                          @RequestParam String city,
                                          @RequestParam String country,
                                          @RequestParam String expiryDate,
                                          @RequestParam String paymentType,
                                          @RequestParam String isDefault) {
        try {
            BillingDetails billingDetails = new BillingDetails(cardNumber, email, cvv, postalCode, city, country, expiryDate, paymentType, isDefault);
            databaseConnectionHandler.addBilling(billingDetails);
            return new ResponseEntity<>("Added all billing details successfully", HttpStatus.OK);
        } catch (SQLException e) {
            return new ResponseEntity<>("Failed to add billing details: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addInstance")
    public ResponseEntity<String> addInstance(@RequestParam String name,
                                              @RequestParam String serverID,
                                              @RequestParam String projectID,
                                              @RequestParam String type,
                                              @RequestParam String totalCost,
                                              @RequestParam String status,
                                              @RequestParam String launchDate,
                                              @RequestParam String stopDate) {
        try {
            Integer id = databaseConnectionHandler.getNextInstanceID();
            Instance instance = new Instance(id, name, serverID, projectID, type, totalCost, status, launchDate, stopDate);
            databaseConnectionHandler.addInstance(instance);
            return new ResponseEntity<>("Added instance successfully", HttpStatus.OK);
        } catch (SQLException e) {
            return new ResponseEntity<>("Failed to add instance: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addProjectService")
    public ResponseEntity<String> addProjectService(@RequestParam String projectID,
                                                    @RequestParam String name) {
        try {
            databaseConnectionHandler.insertProjectService(projectID, name);
            return new ResponseEntity<>("Added service successfully", HttpStatus.OK);
        } catch (SQLException e) {
            return new ResponseEntity<>("Failed to add service: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/addCustomerService")
    public ResponseEntity<String> addCustomerService(@RequestParam String email,
                                                     @RequestParam String name) {
        try {
            databaseConnectionHandler.insertCustomerService(email, name);
            return new ResponseEntity<>("Added service successfully", HttpStatus.OK);
        } catch (SQLException e) {
            return new ResponseEntity<>("Failed to add service: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}