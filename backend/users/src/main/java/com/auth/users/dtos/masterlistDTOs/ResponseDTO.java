package com.auth.users.dtos.masterlistDTOs;

import com.auth.users.entities.MasterList;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ResponseDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ResponseDTO(MasterList masterList) {
        this.id = masterList.getId();
        this.name = masterList.getName();
        this.createdAt = masterList.getCreatedAt();
        this.updatedAt = masterList.getUpdatedAt();
    }
}
