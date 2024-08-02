package com.cloud.services.model;

public class Project {
    private Integer id;
    private String name;
    private String description;
    private String creationDate;
    private String status;
    private String partnerEmail;

    public Project(Integer id, String name, String description, String creationDate, String status, String partnerEmail) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.creationDate = creationDate;
        this.status = status;
        this.partnerEmail = partnerEmail;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public String getStatus() {
        return status;
    }

    public String getPartnerEmail() {
        return partnerEmail;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPartnerEmail(String partnerEmail) {
        this.partnerEmail = partnerEmail;
    }
}
