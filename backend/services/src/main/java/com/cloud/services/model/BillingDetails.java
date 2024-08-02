package com.cloud.services.model;

public class BillingDetails {
    private String CardNumber;
    private String Email;
    private String CVV;
    private String PostalCode;
    private String City;
    private String Country;
    private String ExpiryDate;
    private String PaymentType;
    private String IsDefault;

    public BillingDetails(String cardNumber, String email, String CVV, String postalCode, String city, String country, String expiryDate, String paymentType, String isDefault) {
        CardNumber = cardNumber;
        Email = email;
        this.CVV = CVV;
        PostalCode = postalCode;
        City = city;
        Country = country;
        ExpiryDate = expiryDate;
        PaymentType = paymentType;
        IsDefault = isDefault;
    }

    public String getCardNumber() {
        return CardNumber;
    }

    public String getEmail() {
        return Email;
    }

    public String getCVV() {
        return CVV;
    }

    public String getPostalCode() {
        return PostalCode;
    }

    public String getCity() {
        return City;
    }

    public String getCountry() {
        return Country;
    }

    public String getExpiryDate() {
        return ExpiryDate;
    }

    public String getPaymentType() {
        return PaymentType;
    }

    public String getIsDefault() {
        return IsDefault;
    }

    public void setCardNumber(String cardNumber) {
        CardNumber = cardNumber;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public void setCVV(String CVV) {
        this.CVV = CVV;
    }

    public void setPostalCode(String postalCode) {
        PostalCode = postalCode;
    }

    public void setCity(String city) {
        City = city;
    }

    public void setCountry(String country) {
        Country = country;
    }

    public void setExpiryDate(String expiryDate) {
        ExpiryDate = expiryDate;
    }

    public void setPaymentType(String paymentType) {
        PaymentType = paymentType;
    }

    public void setIsDefault(String isDefault) {
        IsDefault = isDefault;
    }

}