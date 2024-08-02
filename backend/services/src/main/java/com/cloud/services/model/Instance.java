package com.cloud.services.model;

public class Instance {
    private String InstanceID;
    private String Name;
    private String ServerID;
    private String ProjectID;
    private String Type;
    private String TotalCost;
    private String Status;
    private String LaunchDate;
    private String StopDate;

    public Instance(String instanceID, String name, String serverID, String projectID, String type, String totalCost, String status, String launchDate, String stopDate) {
        InstanceID = instanceID;
        Name = name;
        ServerID = serverID;
        ProjectID = projectID;
        Type = type;
        TotalCost = totalCost;
        Status = status;
        LaunchDate = launchDate;
        StopDate = stopDate;
    }

    public String getInstanceID() {
        return InstanceID;
    }

    public String getName() {
        return Name;
    }

    public String getServerID() {
        return ServerID;
    }

    public String getProjectID() {
        return ProjectID;
    }

    public String getType() {
        return Type;
    }

    public String getTotalCost() {
        return TotalCost;
    }

    public String getStatus() {
        return Status;
    }

    public String getLaunchDate() {
        return LaunchDate;
    }

    public String getStopDate() {
        return StopDate;
    }

    public void setInstanceID(String instanceID) {
        InstanceID = instanceID;
    }

    public void setName(String name) {
        Name = name;
    }

    public void setServerID(String serverID) {
        ServerID = serverID;
    }

    public void setProjectID(String projectID) {
        ProjectID = projectID;
    }

    public void setType(String type) {
        Type = type;
    }

    public void setTotalCost(String totalCost) {
        TotalCost = totalCost;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public void setLaunchDate(String launchDate) {
        LaunchDate = launchDate;
    }

    public void setStopDate(String stopDate) {
        StopDate = stopDate;
    }
}
