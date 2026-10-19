package com.auth.users.services;

import com.auth.users.appExceptions.BadRequestException;
import com.auth.users.dtos.user.AdminUpdateUserDTO;
import com.auth.users.dtos.user.AdminUserQueryDTO;
import com.auth.users.dtos.user.AdminUserResponseDTO;
import com.auth.users.dtos.user.PaginatedUsersResponseDTO;
import com.auth.users.dtos.user.UserStatsDTO;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminUserServiceImpl adminUserService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).name("John Doe").email("john@example.com").role(Role.NORMAL_USER).isBlocked(false)
                .isEmailVerified(true).phoneNumber("9876543210").companyName(null).build();
    }

    @Test
    @DisplayName("getUsersPaged should return paginated users")
    void getUsersPaged_Success() {
        AdminUserQueryDTO query = AdminUserQueryDTO.builder().page(1).limit(10).build();
        when(userRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(new PageImpl<>(List.of(sampleUser)));

        PaginatedUsersResponseDTO response = adminUserService.getUsersPaged(query);

        assertNotNull(response);
        assertEquals(1, response.getTotalCount());
        assertEquals(1, response.getResult().size());
        assertEquals("John Doe", response.getResult().get(0).getName());
        assertEquals(Role.NORMAL_USER, response.getResult().get(0).getRole());
    }

    @Test
    @DisplayName("toggleBlock should invert isBlocked flag")
    void toggleBlock_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        AdminUserResponseDTO response = adminUserService.toggleBlock(1L, 99L);

        assertTrue(response.isBlocked());
        verify(userRepository).save(sampleUser);
    }

    @Test
    @DisplayName("toggleBlock should throw BadRequestException when admin blocks their own account")
    void toggleBlock_PreventSelfBlock() {
        assertThrows(BadRequestException.class, () -> adminUserService.toggleBlock(99L, 99L));
        verify(userRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("updateUser should update attributes correctly")
    void updateUser_Success() {
        AdminUpdateUserDTO updateDTO = AdminUpdateUserDTO.builder().name("John Updated").role(Role.BUS_OWNER).companyName("John Travels")
                .phoneNumber("1234567890").isBlocked(false).isEmailVerified(true).build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        AdminUserResponseDTO response = adminUserService.updateUser(1L, updateDTO);

        assertEquals("John Updated", response.getName());
        assertEquals(Role.BUS_OWNER, response.getRole());
        assertEquals("John Travels", response.getCompanyName());
    }

    @Test
    @DisplayName("deleteUser should delete user and prevent self delete")
    void deleteUser_SuccessAndSelfGuard() {
        // Self-delete prevention
        assertThrows(BadRequestException.class, () -> adminUserService.deleteUser(99L, 99L));

        // Normal delete
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        adminUserService.deleteUser(1L, 99L);
        verify(userRepository).delete(sampleUser);
    }

    @Test
    @DisplayName("getUserStats should return aggregated metrics")
    void getUserStats_Success() {
        when(userRepository.count()).thenReturn(10L);
        when(userRepository.countByRole(Role.NORMAL_USER)).thenReturn(6L);
        when(userRepository.countByRole(Role.BUS_OWNER)).thenReturn(3L);
        when(userRepository.countByRole(Role.SUPER_ADMIN)).thenReturn(1L);
        when(userRepository.countByIsBlocked(true)).thenReturn(2L);
        when(userRepository.countByIsEmailVerified(true)).thenReturn(8L);

        UserStatsDTO stats = adminUserService.getUserStats();

        assertEquals(10L, stats.getTotalUsers());
        assertEquals(6L, stats.getNormalUsers());
        assertEquals(3L, stats.getBusOwners());
        assertEquals(1L, stats.getSuperAdmins());
        assertEquals(2L, stats.getBlockedUsers());
        assertEquals(8L, stats.getVerifiedUsers());
    }
}
