package com.auth.users.services;

import com.auth.users.dtos.user.*;

public interface AdminUserService {
    PaginatedUsersResponseDTO getUsersPaged(AdminUserQueryDTO query);

    AdminUserResponseDTO toggleBlock(Long userId, Long adminUserId);

    AdminUserResponseDTO updateUser(Long userId, AdminUpdateUserDTO body);

    void deleteUser(Long userId, Long adminUserId);

    UserStatsDTO getUserStats();
}
