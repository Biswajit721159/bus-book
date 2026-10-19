package com.auth.users.dtos.user;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedUsersResponseDTO {
    private int totalPage;
    private long totalCount;
    private int currentPage;
    private List<AdminUserResponseDTO> result;
}
