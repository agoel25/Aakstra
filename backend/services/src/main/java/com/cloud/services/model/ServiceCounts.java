package com.cloud.services.model;

public class ServiceCounts {
    private String type;
    private Integer count;

    public ServiceCounts(String type, Integer count) {
        this.type = type;
        this.count = count;
    }

    public String getType() {
        return type;
    }

    public Integer getCount() {
        return count;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
