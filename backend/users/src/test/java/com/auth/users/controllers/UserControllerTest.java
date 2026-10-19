package com.auth.users.controllers;

import com.auth.users.appExceptions.ResourceNotFoundException;
import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.*;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.UserRepository;
import com.auth.users.services.AdminUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdminUserService adminUserService;

    @InjectMocks
    private UserController userController;

    private User currentUser;
    private User managedUser;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        currentUser = User.builder().id(10L).name("Old Name").email("test@example.com").role(Role.NORMAL_USER).build();

        managedUser = User.builder().id(10L).name("Old Name").email("test@example.com").role(Role.NORMAL_USER).password(
                "hashed-password-preserved").isEmailVerified(true).build();

        authentication = new UsernamePasswordAuthenticationToken(currentUser, null, Collections.emptyList());
    }

    @Test
    @DisplayName("updateUser should update name on managed entity and return 200 OK")
    void updateUser_Success() {
        UpdateUserRequestDTO requestDTO = new UpdateUserRequestDTO();
        requestDTO.setName("Updated Full Name");

        when(userRepository.findById(10L)).thenReturn(Optional.of(managedUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<ApiResponse<Void>> response = userController.updateUser(requestDTO, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Profile updated successfully", response.getBody().getMessage());

        assertEquals("Updated Full Name", managedUser.getName());
        assertEquals("hashed-password-preserved", managedUser.getPassword());
        verify(userRepository, times(1)).save(managedUser);
    }

    @Test
    @DisplayName("updateUser should return 401 UNAUTHORIZED when authentication is missing or principal is invalid")
    void updateUser_UnauthorizedWhenNoPrincipal() {
        UpdateUserRequestDTO requestDTO = new UpdateUserRequestDTO();
        requestDTO.setName("New Name");

        ResponseEntity<ApiResponse<Void>> nullAuthResponse = userController.updateUser(requestDTO, null);
        assertEquals(HttpStatus.UNAUTHORIZED, nullAuthResponse.getStatusCode());

        Authentication anonymousAuth = new UsernamePasswordAuthenticationToken("anonymousUser", null);
        ResponseEntity<ApiResponse<Void>> anonAuthResponse = userController.updateUser(requestDTO, anonymousAuth);
        assertEquals(HttpStatus.UNAUTHORIZED, anonAuthResponse.getStatusCode());

        verify(userRepository, never()).findById(anyLong());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateUser should throw ResourceNotFoundException when user id not found in database")
    void updateUser_ThrowsResourceNotFoundWhenUserNotFoundInDb() {
        UpdateUserRequestDTO requestDTO = new UpdateUserRequestDTO();
        requestDTO.setName("New Name");

        when(userRepository.findById(10L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userController.updateUser(requestDTO, authentication));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("getUserByPage should return paginated response")
    void getUserByPage_Success() {
        PaginatedUsersResponseDTO mockResponse = PaginatedUsersResponseDTO.builder().totalPage(1).totalCount(1).currentPage(1).result(List
                .of(AdminUserResponseDTO.builder().id(1L).name("User").email("user@example.com").build())).build();

        when(adminUserService.getUsersPaged(any(AdminUserQueryDTO.class))).thenReturn(mockResponse);

        ResponseEntity<ApiResponse<PaginatedUsersResponseDTO>> response = userController.getUserByPage(1, 10, null, null, null, null, null,
                null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getData().getTotalCount());
        verify(adminUserService).getUsersPaged(any(AdminUserQueryDTO.class));
    }

    @Test
    @DisplayName("getUserStats should return user stats")
    void getUserStats_Success() {
        UserStatsDTO stats = UserStatsDTO.builder().totalUsers(5).normalUsers(3).build();
        when(adminUserService.getUserStats()).thenReturn(stats);

        ResponseEntity<ApiResponse<UserStatsDTO>> response = userController.getUserStats();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(5, response.getBody().getData().getTotalUsers());
    }

    @Test
    @DisplayName("toggleBlockUser should toggle user block state")
    void toggleBlockUser_Success() {
        AdminUserResponseDTO dto = AdminUserResponseDTO.builder().id(5L).isBlocked(true).build();
        when(adminUserService.toggleBlock(5L, 10L)).thenReturn(dto);

        ResponseEntity<ApiResponse<AdminUserResponseDTO>> response = userController.toggleBlockUser(5L, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().getData().isBlocked());
        verify(adminUserService).toggleBlock(5L, 10L);
    }

    @Test
    @DisplayName("updateUserByAdmin should update user details")
    void updateUserByAdmin_Success() {
        AdminUpdateUserDTO updateDTO = AdminUpdateUserDTO.builder().name("Updated").build();
        AdminUserResponseDTO dto = AdminUserResponseDTO.builder().id(5L).name("Updated").build();
        when(adminUserService.updateUser(5L, updateDTO)).thenReturn(dto);

        ResponseEntity<ApiResponse<AdminUserResponseDTO>> response = userController.updateUserByAdmin(5L, updateDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Updated", response.getBody().getData().getName());
    }

    @Test
    @DisplayName("deleteUserByAdmin should invoke service delete")
    void deleteUserByAdmin_Success() {
        doNothing().when(adminUserService).deleteUser(5L, 10L);

        ResponseEntity<ApiResponse<Void>> response = userController.deleteUserByAdmin(5L, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(adminUserService).deleteUser(5L, 10L);
    }
}
