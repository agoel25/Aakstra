package com.cloud.services.model;

public class InstanceCost {
    private String type;
    private Integer cost;

    public InstanceCost(String type, Integer cost) {
        this.type = type;
        this.cost = cost;
    }

    public String getType() {
        return type;
    }

    public Integer getCost() {
        return cost;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }
}
