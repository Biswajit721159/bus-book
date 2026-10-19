package com.booking.bus.dtos.bus;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchBusByUserDTO {
    @NotBlank(message = "Source station is required")
    private String source;

    @NotBlank(message = "Destination station is required")
    @JsonProperty("dist")
    @JsonAlias({"dist", "destination"})
    private String dist;
}
