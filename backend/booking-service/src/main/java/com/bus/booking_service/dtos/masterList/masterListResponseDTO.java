package com.bus.booking_service.dtos.masterList;

import com.bus.booking_service.entities.MasterList;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class masterListResponseDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public masterListResponseDTO(MasterList masterList) {
        this.id = masterList.getId();
        this.name = masterList.getName();
        this.createdAt = masterList.getCreatedAt();
        this.updatedAt = masterList.getUpdatedAt();
    }
}
