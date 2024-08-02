package com.cloud.services.service;

import com.cloud.services.database.DatabaseConnectionHandler;
import com.cloud.services.model.BillingDetails;
import com.cloud.services.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@Service
@RestController
@RequestMapping("/api")
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
}