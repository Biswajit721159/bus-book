package com.auth.users.dtos.masterlist;

import com.auth.users.entities.MasterList;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ResponseDTO {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ResponseDTO() {
    }

    public ResponseDTO(MasterList masterList) {
        this.id = masterList.getId();
        this.name = masterList.getName();
        this.createdAt = masterList.getCreatedAt();
        this.updatedAt = masterList.getUpdatedAt();
    }
}
