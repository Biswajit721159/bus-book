package com.auth.users.dtos.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private long totalUsers;
    private long normalUsers;
    private long busOwners;
    private long superAdmins;
    private long blockedUsers;
    private long verifiedUsers;
}
