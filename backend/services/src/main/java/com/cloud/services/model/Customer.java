package com.cloud.services.model;

public class Customer {
    private String email;
    private String name;
    private String phoneNumber;
    private String password;
    private String address;

    public Customer(String email, String name, String phoneNumber, String password, String address) {
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public String getAddress() {
        return address;
    }
}
