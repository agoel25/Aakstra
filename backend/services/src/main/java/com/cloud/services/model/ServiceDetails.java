package com.cloud.services.model;

public class ServiceDetails {
    private String Name;
    private String Description;
    private String Status;
    private String CostPerUnit;
    private String Type;
    private String CostType;

    public ServiceDetails(String name, String description, String status, String costPerUnit, String type, String costType) {
        Name = name;
        Description = description;
        Status = status;
        CostPerUnit = costPerUnit;
        Type = type;
        CostType = costType;
    }

    public String getName() {
        return Name;
    }

    public String getDescription() {
        return Description;
    }

    public String getStatus() {
        return Status;
    }

    public String getCostPerUnit() {
        return CostPerUnit;
    }

    public String getType() {
        return Type;
    }

    public String getCostType() {
        return CostType;
    }

    public void setName(String name) {
        Name = name;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public void setCostPerUnit(String costPerUnit) {
        CostPerUnit = costPerUnit;
    }

    public void setType(String type) {
        Type = type;
    }

    public void setCostType(String costType) {
        CostType = costType;
    }
}
