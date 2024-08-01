package com.cloud.services.service;

import com.cloud.services.database.DatabaseConnectionHandler;
import com.cloud.services.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@Service
@RestController
@RequestMapping("/api")
public class MainService {

    @Autowired
    private DatabaseConnectionHandler databaseConnectionHandler;

    @PostMapping("/signup")
    public Customer signup(@RequestParam String email,
                           @RequestParam String name,
                           @RequestParam String phoneNumber,
                           @RequestParam String password,
                           @RequestParam String address) {
        Customer customer = new Customer(email, name, phoneNumber, password, address);
        databaseConnectionHandler.insertCustomer(customer);
        return customer;
    }

}
