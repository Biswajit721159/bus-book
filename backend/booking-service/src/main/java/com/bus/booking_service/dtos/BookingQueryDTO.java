package com.bus.booking_service.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookingQueryDTO {

    @JsonProperty("currentPage")
    @JsonAlias({"current_page", "page"})
    private int currentPage = 1;

    @JsonProperty("email")
    @JsonAlias({"Email"})
    private String email;

    @JsonProperty("src")
    @JsonAlias({"Src", "source", "Source"})
    private String src;

    @JsonProperty("dist")
    @JsonAlias({"Dist", "destination", "Destination"})
    private String dist;

    @JsonProperty("bookingDate")
    @JsonAlias({"BookingDate", "date", "Date", "booking_date"})
    private String bookingDate;

    @JsonProperty("busName")
    @JsonAlias({"BusName", "bus_name"})
    private String busName;

    @JsonProperty("pnr")
    @JsonAlias({"pnrNumber", "pnr_number", "Pnr"})
    private String pnr;

    @JsonProperty("bookingId")
    @JsonAlias({"booking_id", "id", "BookingId"})
    private String bookingId;

    @JsonProperty("search")
    @JsonAlias({"query", "keyword", "Search"})
    private String search;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSrc() {
        return src;
    }

    public void setSrc(String src) {
        this.src = src;
    }

    public String getDist() {
        return dist;
    }

    public void setDist(String dist) {
        this.dist = dist;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBusName() {
        return busName;
    }

    public void setBusName(String busName) {
        this.busName = busName;
    }
}
